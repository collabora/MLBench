#!/bin/bash

if ! command -v pip &> /dev/null; then
    echo "pip is not installed. Please install pip before proceeding."
    exit 1
fi

pip install tflite_runtime

if [ $? -eq 0 ]; then
    echo "tflite_runtime has been successfully installed."
else
    echo "Failed to install tflite_runtime. Please check your pip installation and try again."
    exit 1
fi

pip install onnxruntime

if [ $? -eq 0 ]; then
    echo "onnxruntime has been successfully installed."
else
    echo "Failed to install onnxruntime. Please check your pip installation and try again."
    exit 1
fi
