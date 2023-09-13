# MLBench

Welcome to MLBench! We've developed a benchmarking framework to assess the performance of Machine Learning models on a variety of hardware platforms, including Coral TPU, Rockpi RK3399, and Jetson Nano(we are expanding the list). Our versatile framework accommodates multiple deep learning frameworks and offers in-depth performance metrics, covering accuracy, latency, temperature, power consumption, memory usage, GPU utilization, CPU core frequencies and much more. All these insights are neatly organized and displayed on an interactive dashboard, making it effortless to compare and visualize the results.

## Table of Contents
- [Introduction](#introduction)
- [Supported Hardware Platforms](#supported-hardware-platforms)
- [Supported Frameworks](#supported-frameworks)
- [Getting Started](#getting-started)
- [Results Dashboard](#results-dashboard)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Benchmarking Machine Learning models on diverse hardware platforms is essential for optimizing their performance and tailoring them to specific applications. MLBench is designed to provide you with a user-friendly and comprehensive framework to perform these evaluations effortlessly.

## Supported Hardware Platforms

- Coral TPU
- Rockpi RK3399
- NVIDIA Jetson Nano

## Supported Frameworks

- TFLite
- TensorRT
- ONNXRuntime

## Getting Started

- Clone the repo
```bash
 git clone https://github.com/collabora/MLBench.git
```

- Hardware Setup
 - Ensure that your hardware platforms are properly connected and configured for benchmarking.
 - Connect each hardware platform to the power monitoring board. This board will track power consumption in real-time during the benchmark run. This is how our setup looks.
 - During the benchmarking process, the power monitoring board will record power consumption data, which will be integrated into the benchmark results. MLBench takes care of collecting and processing this data, so you can easily analyze power consumption alongside other performance metrics.

- Install requirements based on the hardware
```bash
 pip install -r requirements.txt
 TODO: add hardware specific installation scripts
```

- Download the imagenet validation set
```bash
 cd 
 bash scripts/download_imagenet.sh
```

- Run the benchmark
```bash
 python3 src/main.py --backend tensorrt --model_path /mnt/workspace/models/mobilenetv3_small_fp32.engine --model_name mobilenet_v3_small --preprocessed-dir /mnt/workspace/imagenet_preprocessed_224 --results_dir /mnt/workspace/mlbench_results --input_size 224,224
```

## MLBench Dashboard
Our project features an interactive results dashboard that empowers you to effortlessly compare and visualize benchmarking results. Access the [MLBench Dashboard here](mlbench.kurg.org:5000).


## Contributing
We warmly welcome contributions from the community to enhance MLBench. 

## License
This project is licensed under the MIT License.
