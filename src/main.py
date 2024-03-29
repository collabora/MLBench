import argparse
import utils
from tqdm import tqdm
import os
import numpy as np
import time
import requests
import metrics


def main(args):
    print(args)
    os.makedirs(args.preprocessed_dir, exist_ok=True)

    backend = None
    data = None
    if args.backend == "tensorrt":
        from backends.tensorrt import TRTBackend
        if args.model_path is not None:
            precision = "fp16" if "fp16" in args.model_path else "fp32"
        elif args.precision is not None:
            precision = args.precision
        else:
            precision = "fp16"
        backend = TRTBackend(name="tensorrt", precision=precision)
        data = np.ones((1 * 3 * 224 * 224), dtype=np.float32)
    
    if args.backend == "tflite":
        if args.device == None:
            raise ValueError("Please mention the device to run tflite backend --device tpu/cpu")
        from backends.tflite import TfliteBackend
        backend = TfliteBackend(name="tflite", device=args.device)
        data = np.ones((args.input_size[0], args.input_size[1], 3), dtype=np.float32)
    
    if args.backend == "ncnn":
        from backends.ncnn import NCNNBackend
        backend = NCNNBackend()
        data = np.ones((1, 3, 224, 224), dtype=np.float32)
    
    if args.backend in ["onnx", "onnxruntime"]:
        from backends.onnx_backend import ONNXBackend
        backend = ONNXBackend(name="onnxruntime", device=args.device)
        data = np.ones((1, 3, args.input_size[0], args.input_size[1]), dtype=np.float32)

    
    # preprocess and save np array
    jpeg_files_list = os.listdir(args.imagenet)

    preprocess_func = backend.get_preprocess_func(args.model_name)
    
    if args.count:
        jpeg_files_list = jpeg_files_list[:args.count]

    for filename in tqdm(jpeg_files_list, desc="Preprocessing", unit="image"):
        if not filename.lower().endswith('.jpeg'):
            continue
        jpeg_path = os.path.join(args.imagenet, filename)
        npy_path = os.path.join(args.preprocessed_dir, filename.replace("JPEG", "npy"))
        if os.path.exists(npy_path):
            continue
        preprocessed = preprocess_func(jpeg_path, size=args.input_size)
        np.save(npy_path, preprocessed)
    
    # load val_map
    labels = {}
    with open(os.path.join(args.imagenet, 'val_map.txt'), "r") as f:
        lines = f.readlines()
        for line in lines:
            p, l = line.split(' ')
            labels[p.split('.')[0]] = int(l)
    times = []
    accuracy = []

    

    if backend is None:
        print("backend is none")
        return
    
    backend.load_backend(args.model_path, model_name=args.model_name)
    backend.warmup(data)

    backend.capture_stats()

    npy_arrays = os.listdir(args.preprocessed_dir)
    if args.count is not None:
        npy_arrays = npy_arrays[:args.count]

    # start power measuring
    response = metrics.start_PAC1931()
    print(f"start time---- {time.localtime()}")
    for npy_arr in tqdm(npy_arrays,  desc="Running inference"):
        inputs = np.load(os.path.join(args.preprocessed_dir, npy_arr))
        outputs, infer_time = backend(inputs)
        times.append(infer_time)
        pred = backend.get_pred(outputs)
        gt = labels[npy_arr.split('.')[0]]
        if pred==gt:
            accuracy.append(1)
        else:
            accuracy.append(0)
    print(f"end time---- {time.localtime()}")
    response = metrics.stop_PAC1931()

    board_name = utils.get_device_model()
    if board_name == "Freescale i.MX8MQ Phanbell":
        bus_id = 1
    elif board_name == "NVIDIA Jetson Nano 2GB Developer Kit":
        bus_id = 2
    else:
        bus_id = 3

    power = utils.parse_power_response(response, bus_id)

    backend.stop_event.set()
    backend.destroy()

    np_acc = np.array(accuracy)
    np_lat = np.array(times)
    print(f"Accuracy = {np.count_nonzero(np_acc == 1)/len(np_acc)}")
    print(f"Latency = {np.sum(np_lat)/len(np_lat)}") 
      
    stats = backend.get_avg_stats()

    data_dict = {}
    data_dict["system"] = utils.get_device_model()
    data_dict["processor"] = utils.get_cpu()
    data_dict["accelerator"] = backend.get_accelerator()
    data_dict["model_name"] = backend.model_name
    data_dict["framework"] = f"{args.backend}"
    data_dict["version"] = str(backend.version())
    data_dict["latency"] = round(float(np.sum(np_lat)/len(np_lat))*1000, 3)
    data_dict["precision"] = backend.precision
    data_dict["accuracy"] = round(float(np.count_nonzero(np_acc == 1)/len(np_acc))*100, 3)
    data_dict["cpu"] = float(round(np.average(stats["cpu"]), 2)) if "cpu" in stats else ""
    data_dict["memory"] = float(round(np.average(stats["memory"]), 2)) if "memory" in stats else ""
    data_dict["power"] = float(round(np.average(power), 2)) if len(power) else ""
    data_dict["temperature"] = float(round(np.average(stats["temperature"]), 2)) if "temperature" in stats else ""
    print(data_dict)

    response = post(data_dict, url="http://transcription.kurg.org:27017/bench/insert")
    
    # Write the dictionary to the JSON file
    import json
    if not os.path.exists(os.path.join(args.results_dir, args.model_name)):
        os.makedirs(os.path.join(args.results_dir, args.model_name), exist_ok=True)
    with open(os.path.join(args.results_dir, args.model_name, f"{backend.precision}_results.json"), 'w') as json_file:
        json.dump(data_dict, json_file)

    # Send detailed sensors to the db
    data_dict = {}
    data_dict["benchmark_id"] = response["benchmark_id"]
    data_dict["cpu_usage"] = stats["cpu"].tolist()
    data_dict["cpu_freq"] = stats["cpu_freq"]
    data_dict["temperature"] = stats["temperature"].tolist()
    data_dict["memory"] = stats["memory"].tolist()
    data_dict["power"] = power.tolist()
    data_dict["tpu_freq"] = stats["tpu_freq"] if "tpu_freq" in stats.keys() else ""
    data_dict["gpu_freq"] = stats["gpu_freq"] if "gpu_freq" in stats.keys() else ""
    data_dict["gpu_util"] = stats["gpu_util"] if "gpu_util" in stats.keys() else ""

    response = post(data_dict, url="http://transcription.kurg.org:27017/bench/insert_metric")
    with open(os.path.join(args.results_dir, args.model_name, f"{backend.precision}_results_stats.json"), 'w') as json_file:
        json.dump(data_dict, json_file)


def post(data, url=None):
    if url is None:
        return
    response = requests.post(url, json=data)
    return response.json()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--imagenet",
        default='/mnt/workspace/imagenet-2012/val',
        type=str,
        help="directory with imagenet images"
    )
    parser.add_argument(
        "--preprocessed-dir",
        default="/mnt/workspace/imagenet_preprocessed",
        type=str,
        help="directory to store preprocessed np array"
    )
    parser.add_argument(
        "--backend",
        default=None,
        type=str,
        help="backend name"
    )
    parser.add_argument(
        "--model_name",
        default=None,
        type=str,
        help="model name"
    )
    parser.add_argument(
        "--model_path",
        default=None,
        type=str,
        help="model path"
    )
    parser.add_argument(
        "--count",
        default=None,
        type=int,
        help="no of images to run benchmark on"
    )
    parser.add_argument(
        "--input_size",
        type=lambda x: tuple(map(int, x.split(','))),
        help="input size as values as 'x,y'",
        default=(224, 224),
        required=True
    )
    parser.add_argument(
        "--results_dir",
        default=None,
        type=str,
        help="directory to save results"
    )
    parser.add_argument(
        "--device",
        default="cpu",
        type=str,
        help="device to run benchmark on"
    )
    parser.add_argument(
        "--precision",
        default=None,
        type=str,
        help="tensorrt model precision"
    )

    args = parser.parse_args()
    main(args)
