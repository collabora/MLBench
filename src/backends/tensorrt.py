import argparse
import time
import psutil
import os
import numpy as np
import tensorrt as trt
import pycuda.autoinit  # noqa # pylint: disable=unused-import
import pycuda.driver as cuda
import threading
import subprocess
import requests

from tqdm import tqdm
from queue import Queue

import utils
from backends.backend import Backend


class TRTBackend(Backend):
    """TensorRT inference utility class.
    """
    def __init__(self, name, precision=None):
        """Initialize.
        """
        super(TRTBackend, self).__init__(name)
        self.precision = "fp32" if precision is None else precision
    
    def name(self):
        return self.name
    
    def version(self):
        return trt.__version__
    
    def warmup(self, inputs, warmup_steps=100):
        for step in range(warmup_steps):
            self(inputs)
        
    def load_backend(self, model_path, model_name):
        self.model_name = model_name

        # Create a Context on this device,
        self._ctx = cuda.Device(0).make_context()
        self._logger = trt.Logger(trt.Logger.INFO)
        self._stream = cuda.Stream()

        # initiate engine related class attributes
        self._engine = None
        self._context = None
        self._inputs = None
        self._outputs = None
        self._bindings = None

        self._load_model(model_path)
        self._allocate_buffers()

    def _deserialize_engine(self, trt_engine_path: str) -> trt.tensorrt.ICudaEngine:
        """Deserialize TensorRT Cuda Engine
        Args:
            trt_engine_path (str): path to engine file
        Returns:
            trt.tensorrt.ICudaEngine: deserialized engine
        """
        with open(trt_engine_path, 'rb') as engine_file:
            with trt.Runtime(self._logger) as runtime:
                engine = runtime.deserialize_cuda_engine(engine_file.read())

        return engine
    
    def _allocate_buffers(self) -> None:
        """Allocates memory for inference using TensorRT engine.
        """
        inputs, outputs, bindings = [], [], []
        for binding in self._engine:
            size = trt.volume(self._engine.get_binding_shape(binding))
            dtype = trt.nptype(self._engine.get_binding_dtype(binding))
            host_mem = cuda.pagelocked_empty(size, dtype)
            device_mem = cuda.mem_alloc(host_mem.nbytes)
            bindings.append(int(device_mem))
            if self._engine.binding_is_input(binding):
                inputs.append({'host': host_mem, 'device': device_mem})
            else:
                outputs.append({'host': host_mem, 'device': device_mem})

        # set buffers
        self._inputs = inputs
        self._outputs = outputs
        self._bindings = bindings

    def _load_model(self, engine_path):
        print("[INFO] Deserializing TensorRT engine ...")
        # build engine with given configs and load it
        if not os.path.exists(engine_path):
            raise FileNotFoundError(f"TensorRT engine does not exist {engine_path}.")

        # deserialize and load engine
        self._engine = self._deserialize_engine(engine_path)

        if not self._engine:
            raise Exception("[Error] Couldn't deserialize engine successfully !")

        # create execution context
        self._context = self._engine.create_execution_context()
        if not self._context:
            raise Exception(
                "[Error] Couldn't create execution context from engine successfully !")

    def __call__(self, inputs: np.ndarray):
        """Runs inference on the given inputs.
        Args:
            inputs (np.ndarray): channels-first format,
            with/without batch axis
        Returns:
            List[np.ndarray]: inference's output (raw tensorrt output)

        """
        self._ctx.push()

        # copy inputs to input memory
        # without astype gives invalid arg error
        self._inputs[0]['host'] = inputs.ravel()

        # transfer data to the gpu
        cuda.memcpy_htod_async(
            self._inputs[0]['device'], self._inputs[0]['host'], self._stream)
        
        # run inference
        self._context.execute_async(
            batch_size=1,
            bindings=self._bindings,
            stream_handle=self._stream.handle)

        # fetch outputs from gpu
        for out in self._outputs:
            cuda.memcpy_dtoh_async(out['host'], out['device'], self._stream)

        # synchronize stream
        self._stream.synchronize()
        self._ctx.pop()
        return [out['host'] for out in self._outputs]

    def destroy(self):
        """Destroy if any context in the stack.
        """
        try:
            self._ctx.pop()
        except Exception as exception:
            pass
    
    def capture_stats(self):
        self.stop_event = threading.Event()
        self.output_queue = Queue()
        self.process = subprocess.Popen(
            ['tegrastats'], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE
        )
        self.tegrastats_thread = threading.Thread(
            target=utils.read_tegrastats_output,
            args=(self.process, self.output_queue, self.stop_event),
            daemon=True
        )
        self.tegrastats_thread.start()
    
    def get_avg_stats(self):
        ram_usage, cpu_util, gpu_util, temp = [], [], [], []
        
        while not self.output_queue.empty():
            r,c,g,t = self.output_queue.get()
            ram_usage.append(r)
            cpu_util.append(c)
            gpu_util.append(g)
            temp.append(t)
        ram_usage, cpu_util, gpu_util, temp = np.array(ram_usage), np.array(cpu_util), \
                        np.array(gpu_util), np.array(temp)
        
        avg_ram, avg_cpu, avg_gpu, avg_temp = np.sum(ram_usage) / len(ram_usage), \
            np.sum(cpu_util) / len(cpu_util), \
            np.sum(gpu_util) / len(gpu_util), \
            np.sum(temp) / len(temp)
        return round(avg_ram, 3), round(avg_cpu, 3), round(avg_gpu, 3), round(avg_temp, 3)

    def get_pred(self, outputs):
        return np.array(outputs).argmax()
        