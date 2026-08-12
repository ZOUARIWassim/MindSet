#!/bin/bash

# MindSet - Docker Compose Installation Script
# This script installs Docker Compose on your system

set -e

echo "=================================================="
echo "  MindSet - Docker Compose Installation"
echo "=================================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed: $(docker --version)"
echo ""

# Check if Docker Compose is already installed
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose is already installed!"
    docker-compose --version
    exit 0
fi

if docker compose version &> /dev/null; then
    echo "✅ Docker Compose plugin is already installed!"
    docker compose version
    exit 0
fi

echo "📦 Installing Docker Compose..."
echo ""

# Try to install Docker Compose plugin
echo "Method 1: Installing Docker Compose plugin..."
if sudo apt-get update && sudo apt-get install -y docker-compose-plugin; then
    echo ""
    echo "✅ Docker Compose plugin installed successfully!"
    docker compose version
    echo ""
    echo "=================================================="
    echo "  Installation Complete!"
    echo "=================================================="
    echo ""
    echo "Next steps:"
    echo "  cd /home/wassim/Desktop/Wassim_Zephyrus/mindset"
    echo "  make quick-start"
    echo ""
    exit 0
fi

# Fallback: Install standalone binary
echo ""
echo "Method 2: Installing standalone Docker Compose binary..."

DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose; then
    sudo chmod +x /usr/local/bin/docker-compose
    echo ""
    echo "✅ Docker Compose installed successfully!"
    docker-compose --version
    echo ""
    echo "=================================================="
    echo "  Installation Complete!"
    echo "=================================================="
    echo ""
    echo "Next steps:"
    echo "  cd /home/wassim/Desktop/Wassim_Zephyrus/mindset"
    echo "  make quick-start"
    echo ""
    exit 0
fi

echo ""
echo "❌ Automatic installation failed."
echo ""
echo "Please install manually using one of these methods:"
echo ""
echo "Option 1: Docker Compose Plugin"
echo "  sudo apt-get update"
echo "  sudo apt-get install docker-compose-plugin"
echo ""
echo "Option 2: Standalone Binary"
echo "  sudo curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose"
echo "  sudo chmod +x /usr/local/bin/docker-compose"
echo ""
echo "Option 3: Python pip"
echo "  sudo pip3 install docker-compose"
echo ""
exit 1
