"""
Backend Base Class
"""

class Backend:
    def __init__(self, name):
        self.name = name
    
    def warmup(self, data, warmup_steps=100):
        raise NotImplementedError("warmup not implemented")
    
    def name(self):
        raise NotImplementedError("name not implemented")

    def version(self):
        raise NotImplementedError("version not implemented")
    
    def load_backend(self):
        raise NotImplementedError("load not implemented")
    
    def __call__(self):
        raise NotImplementedError("predict not implemented")
        
    def capture_stats(self):
        raise NotImplementedError("capture_stats not implemented")
    
    def get_avg_stats(self):
        raise NotImplementedError("get_avg_stats not implemented")
    
    def destroy(self):
        raise NotImplementedError("destroy not implemented")
