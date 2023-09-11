import time
import threading
import subprocess
import requests
import numpy as np
import onnxruntime as ort

from tqdm import tqdm
from queue import Queue

import utils
from backends.backend import Backend


class ONNXBackend(Backend):
    def __init__(self, name, precision=None, device="cpu"):
        super(ONNXBackend, self).__init__(name)
        self.precision = "fp32" if precision is None else precision
        self.device = device
        if self.device in ["cuda", "gpu"]:
            self.accelerator = utils.build_and_run_device_query()
        else:
            self.accelerator = ""
    
    def get_accelerator(self):
        return self.accelerator

    def name(self):
        return self.name
    
    def version(self):
        return ort.__version__
    
    def get_preprocess_func(self, model_name):
        model_names = ["mobilenet_v2", "mobilenet_v3_small", "mobilenet_v3_large"]
        if model_name not in model_names:
            raise ValueError(f"Please provide a valid model name from {model_names}")
        return utils.preprocess_img
    
    def warmup(self, inputs, warmup_steps=100):
        for step in range(warmup_steps):
            self(inputs)

    def load_backend(self, model_path, model_name):
        self.model_name = model_name
        if self.device == "cuda" and len(ort.get_all_providers()) > 1:
            self.model = ort.InferenceSession(model_path, providers=["CUDAExecutionProvider"])
        else:
            self.model = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])

        self.input_name = self.model.get_inputs()[0].name
        self.output_name = self.model.get_outputs()[0].name

    def __call__(self, inputs):
        if len(inputs.shape) == 3:
            inputs = np.expand_dims(inputs, axis=0)
        input_dict = {self.input_name: inputs.astype(np.float32)}

        start = time.time()
        outputs = self.model.run([self.output_name], input_dict)[0]
        infer_time = time.time() - start
        return outputs, infer_time
    
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
        ram_usage, cpu_util, gpu_util, temp, cpu_freq = [], [], [], [], []
        
        while not self.output_queue.empty():
            r,c,g,t, cf = self.output_queue.get()
            ram_usage.append(r)
            cpu_util.append(c)
            gpu_util.append(g)
            temp.append(t)
            cpu_freq.append(cf)
        ram_usage, cpu_util, temp = np.array(ram_usage), np.array(cpu_util),  np.array(temp)
        
        stats = {
            "cpu": cpu_util,
            "memory": ram_usage,
            "temperature": temp,
            "gpu_util": gpu_util,
            "cpu_freq": cpu_freq
        }
        return stats

    def get_pred(self, outputs):
        return np.array(outputs).argmax()
    
    def destroy(self):
        del self.model
