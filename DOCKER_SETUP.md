# Docker Compose Installation

MindSet requires Docker Compose to orchestrate multiple containers.

## Quick Install Docker Compose

### Option 1: Install Docker Compose Plugin (Recommended)
```bash
# Update package index
sudo apt-get update

# Install docker-compose-plugin
sudo apt-get install docker-compose-plugin

# Verify installation
docker compose version
```

### Option 2: Install Standalone Docker Compose
```bash
# Download latest version
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Option 3: Install via pip (Python)
```bash
# Install using pip
sudo pip3 install docker-compose

# Verify installation
docker-compose --version
```

## After Installation

Once docker-compose is installed, return to the project and run:

```bash
cd /home/wassim/Desktop/Wassim_Zephyrus/mindset

# Build and start everything
make quick-start

# Or step by step
make build
make dev
make health
```

## Alternative: Use Docker Compose V2

If you install the Docker Compose plugin, use `docker compose` (with space) instead of `docker-compose`:

The Makefile will automatically detect which version you have.

## Check Current Setup

```bash
# Check Docker
docker --version

# Check Docker Compose (V2 - plugin)
docker compose version

# Check Docker Compose (V1 - standalone)
docker-compose --version
```

## Your Current Status

- ✅ Docker is installed
- ❌ Docker Compose needs to be installed

**Install Docker Compose using one of the methods above, then run:**
```bash
make quick-start
```
