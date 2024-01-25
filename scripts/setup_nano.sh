#!/bin/bash

pip install pycuda

if [ $? -eq 0 ]; then
    echo "pycuda has been successfully installed."
else
    echo "Failed to install pycuda. Please check your pip installation and try again."
    exit 1
fi

# install onnxruntime
python_ver=$(python3 -V 2>&1 | awk '{print $2}')


if [[ "$python_ver" == "3.6"* ]]; then
    echo "Python 3.6 detected."

    # Install onnxruntime version 1.11.0 using pip
    wget https://nvidia.box.com/shared/static/pmsqsiaw4pg9qrbeckcbymho6c01jj4z.whl -O ~/.cache/onnxruntime_gpu-1.11.0-cp36-cp36m-linux_aarch64.whl
    pip install ~/.cache/onnxruntime_gpu-1.11.0-cp36-cp36m-linux_aarch64.whl

elif [[ "$python_ver" == "3.7"* ]]; then
    echo "Python 3.7 detected."

    # Install onnxruntime version 1.12.0 using pip
    wget https://nvidia.box.com/shared/static/amhb62mzes4flhbfavoa73m5z933pv75.whl -O ~/.cache/onnxruntime_gpu-1.11.0-cp37-cp37m-linux_aarch64.whl
    pip install ~/.cache/onnxruntime_gpu-1.11.0-cp37-cp37m-linux_aarch64.whl

elif [[ "$python_ver" == "3.8"* ]]; then
    echo "Python 3.8 detected."

    wget https://nvidia.box.com/shared/static/2sv2fv1wseihaw8ym0d4srz41dzljwxh.whl -O ~/.cache/onnxruntime_gpu-1.11.0-cp38-cp38m-linux_aarch64.whl
    pip install ~/.cache/onnxruntime_gpu-1.11.0-cp38-cp38m-linux_aarch64.whl

elif [[ "$python_ver" == "3.9"* ]]; then
    echo "Python 3.9 detected."

    wget https://nvidia.box.com/shared/static/jmomlpcctmjojz14zbwa12lxmeh2h6o5.whl -O ~/.cache/onnxruntime_gpu-1.11.0-cp39-cp39m-linux_aarch64.whl
    pip install ~/.cache/onnxruntime_gpu-1.11.0-cp39-cp39m-linux_aarch64.whl

else
    echo "Python version $python_ver is not supported."
    exit 1
fi
