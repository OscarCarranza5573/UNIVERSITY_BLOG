#!/bin/bash

echo "Starting University Blog System in development mode..."

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Iniciar bases de datos primero
echo "🗄️ Starting databases..."
docker-compose up -d mysql mongodb redis

# Esperar que las bases de datos estén listas
echo "⏳ Waiting for databases to be ready..."
sleep 10

# Verificar conexiones
echo "🔍 Checking database connections..."
docker exec university_mysql mysqladmin ping -h localhost --silent
if [ $? -eq 0 ]; then
    echo "✅ MySQL is ready"
else
    echo "❌ MySQL is not ready"
fi

docker exec university_mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ MongoDB is ready"
else
    echo "❌ MongoDB is not ready"
fi

# Iniciar servicios
echo "🚀 Starting services..."
docker-compose up --build

echo "🎉 University Blog System is running!"
echo "🌐 API Gateway: http://localhost:3000"
echo "🔐 Auth Service: http://localhost:3001" 
echo "📚 CV Service: http://localhost:3002"
echo "📁 File Service: http://localhost:3003"