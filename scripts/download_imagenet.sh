#!/bin/bash

pip install gdown

if [ $? -eq 0 ]; then
    echo "gdown has been successfully installed."
    
    echo "Downloading a imagenet validation set..."
    gdown --fuzzy https://drive.google.com/file/d/1NZXbmOixSKDEBJUY1O-QCk7XUwBR9WS8/view?usp=drive_link

    if [ $? -eq 0 ]; then
        echo "File downloaded successfully."
    else
        echo "Failed to download the file."
    fi
else
    echo "Failed to install gdown. Please check your pip installation and try again."
    exit 1
fi