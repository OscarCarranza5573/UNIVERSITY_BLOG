#!/bin/bash

echo "Installing dependencies for all services..."

services=("api-gateway" "auth-service" "cv-service" "file-service")

for service in "${services[@]}"
do
    echo "Installing dependencies for $service..."
    cd $service
    npm install
    cd ..
    echo "✅ $service dependencies installed"
done

echo "🎉 All dependencies installed successfully!"