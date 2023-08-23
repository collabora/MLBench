import ncnn
import numpy as np
import threading
from queue import Queue

from backends.backend import Backend
from models.ncnn import Resnet50

import utils


class NCNNBackend(Backend):
    def __init__(self, name="ncnn"):
        super(NCNNBackend, self).__init__(name)
        self.precision = "fp32"
    
    def name(self):
        return self.name
    
    def version(self):
        return ncnn.__version__
    
    def warmup(self, data, warmup_steps=20):
        for i in range(warmup_steps):
            self(data)

    def load_backend(self, model_path, model_name=None, inputs=None, outputs=None):
        param_file, bin_file = f"{model_path}.param", f"{model_path}.bin"
        if param_file.endswith("resnet50_v1.param"):
            # download model files if doesn't
            self.net = Resnet50(param_file, bin_file)
            self.model_name = "resnet50"
        else:
            import sys
            print("please add your ncnn model .param and .bin files to dir named 'resnet'")
            sys.exit()
        
        if not inputs:
            self.inputs = [self.net.input_name]
        else:
            self.inputs = inputs
        if not outputs:
            self.outputs = [self.net.output_name]
        else:
            self.outputs = outputs
        return self
    
    def __call__(self, inputs):
        return self.net(inputs)
    
    def capture_stats(self):
        self.stop_event = threading.Event()
        self.output_queue = Queue()
        self.psutil_thread = threading.Thread(
            target=utils.get_stats_rockpi, args=(self.output_queue, self.stop_event), daemon=True)
        self.psutil_thread.start()
    
    def get_avg_stats(self):
        cpu_util, ram_usage, temp, cpu_freq = [], [], [], []
        
        while not self.output_queue.empty():
            c, r, t, cf = self.output_queue.get()
            ram_usage.append(r)
            cpu_util.append(c)
            temp.append(t)
            cpu_freq.append(cf)
        ram_usage, cpu_util, temp = np.array(ram_usage), np.array(cpu_util), np.array(temp)
        stats = {
            "cpu": cpu_util,
            "memory": ram_usage,
            "temperature": temp,
            "cpu_freq": cpu_freq
        }
        return stats
    
    def get_pred(self, outputs):
        return outputs.argmax()
    
    def destroy(self):
        self.net.destroy()
        self.psutil_thread.join()
        del self.net
        