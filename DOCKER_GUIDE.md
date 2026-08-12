# MindSet - Docker & Makefile Guide

Complete containerization of MindSet with Docker and easy management via Makefile.

## 🐳 What's Included

### Docker Containers
- **MongoDB** - Database (mongo:8)
- **Backend** - Node.js API (Port 5000)
- **Frontend** - React App (Port 3000)

### Files Created
```
mindset/
├── docker-compose.yml           # Development orchestration
├── docker-compose.prod.yml      # Production orchestration
├── Makefile                     # Command shortcuts
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── backend/
│   ├── Dockerfile              # Production build
│   ├── Dockerfile.dev          # Development with hot-reload
│   └── .dockerignore
└── frontend/
    ├── Dockerfile              # Production with nginx
    ├── Dockerfile.dev          # Development with hot-reload
    ├── nginx.conf              # Nginx configuration
    └── .dockerignore
```

## 🚀 Quick Start

### One Command to Rule Them All
```bash
cd /home/wassim/Desktop/Wassim_Zephyrus/mindset
make quick-start
```

This will:
1. Build all Docker images
2. Start all containers
3. Check health of services
4. Show you the URLs

### Or Step by Step
```bash
# Build images
make build

# Start services
make dev

# Check status
make health
```

## 📋 Makefile Commands

### Essential Commands
```bash
make help           # Show all available commands
make dev            # Start development environment
make start          # Alias for 'dev'
make stop           # Stop all containers
make restart        # Restart everything
make logs           # Show logs from all services
make health         # Check health status
make ps             # Show running containers
```

### Development
```bash
make logs-backend   # Backend logs only
make logs-frontend  # Frontend logs only
make logs-db        # MongoDB logs only
make shell-backend  # Open shell in backend container
make shell-frontend # Open shell in frontend container
make shell-db       # Open MongoDB shell
```

### Production
```bash
make prod           # Start production environment
make prod-build     # Build production images
make prod-stop      # Stop production
```

### Database Management
```bash
make db-backup      # Backup database to ./backups/
make db-restore BACKUP_DIR=./backups/backup-20260812-105930/mindset
make db-reset       # Reset database (deletes all data!)
```

### Cleanup
```bash
make clean          # Stop and remove volumes
make clean-all      # Remove everything (images too)
make prune          # Clean up Docker system
```

### Testing & Monitoring
```bash
make test           # Run all tests
make test-backend   # Backend tests only
make test-frontend  # Frontend tests only
make watch-backend  # Watch backend logs with colors
make watch-frontend # Watch frontend logs with colors
```

### Utilities
```bash
make info           # Show Docker environment info
make ports          # Show port mappings
make status         # Show status of all services
make update         # Pull latest images and restart
make rebuild        # Clean rebuild everything
```

## 🎯 Common Workflows

### Daily Development
```bash
# Morning - Start everything
make dev

# Check if all services are healthy
make health

# Watch logs while working
make logs

# Evening - Stop everything
make stop
```

### Debugging Issues
```bash
# Check what's running
make ps

# Check health of services
make health

# View logs
make logs-backend    # or logs-frontend, logs-db

# Access container shell
make shell-backend   # Inspect backend container
make shell-db        # Query database directly

# Restart specific service
docker-compose restart backend
```

### Database Operations
```bash
# Backup before making changes
make db-backup

# View data in MongoDB
make shell-db
> db.users.find()
> db.habits.find()
> db.habitentries.find()

# Restore if needed
make db-restore BACKUP_DIR=./backups/backup-20260812-105930/mindset

# Reset database for fresh start
make db-reset
```

### Production Deployment
```bash
# Build production images
make prod-build

# Start production environment
make prod

# Check health
make health

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production
make prod-stop
```

## 🌐 Access Points

### Development Mode (make dev)
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **MongoDB**: mongodb://localhost:27017/mindset

### Production Mode (make prod)
- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/mindset

## 🔧 Configuration

### Environment Variables (.env)
```env
# JWT Secret for authentication
JWT_SECRET=your_secure_jwt_secret_here

# MongoDB credentials (production)
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=secure_password_here

# Node environment
NODE_ENV=development
```

### Docker Compose Features

**Development (docker-compose.yml)**
- Hot-reload for both frontend and backend
- Source code mounted as volumes
- Development dependencies included
- Logs visible in real-time

**Production (docker-compose.prod.yml)**
- Optimized builds
- Nginx for frontend (80)
- MongoDB with authentication
- Health checks enabled
- Auto-restart on failure

## 📊 Architecture

```
┌─────────────────────────────────────────────┐
│  Docker Network: mindset-network            │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐    ┌──────────────┐      │
│  │   Frontend   │───▶│   Backend    │      │
│  │ React + Vite │    │  Node.js API │      │
│  │  Port 3000   │    │   Port 5000  │      │
│  └──────────────┘    └───────┬──────┘      │
│         │                    │              │
│         │                    ▼              │
│         │            ┌──────────────┐       │
│         │            │   MongoDB    │       │
│         │            │  Port 27017  │       │
│         │            └──────────────┘       │
│         │                                   │
│  Volumes: mongodb_data, mongodb_config     │
│                                             │
└─────────────────────────────────────────────┘
```

## 🛠️ Troubleshooting

### Containers won't start
```bash
# Check what's running
make ps

# Check logs for errors
make logs

# Clean and rebuild
make rebuild
```

### Port already in use
```bash
# Find what's using the port
lsof -i :3000  # or :5000, :27017

# Kill the process
kill <PID>

# Or change port in docker-compose.yml
```

### MongoDB connection issues
```bash
# Check MongoDB is running
docker ps | grep mongodb

# Check MongoDB logs
make logs-db

# Restart MongoDB
docker-compose restart mongodb
```

### Frontend can't reach backend
```bash
# Check backend health
curl http://localhost:5000/health

# Check network connectivity
docker-compose exec frontend ping backend

# Verify environment variables
docker-compose exec frontend env | grep VITE
```

### Volume permission issues
```bash
# Remove volumes and recreate
make clean
make dev
```

### Images are old/corrupted
```bash
# Pull latest base images
docker-compose pull

# Rebuild without cache
docker-compose build --no-cache

# Or use Makefile
make rebuild
```

## 📝 Development Tips

### Live Reload
Both frontend and backend have live reload enabled:
- **Backend**: Changes in `src/` trigger auto-restart
- **Frontend**: Changes appear instantly in browser

### Debugging in Containers
```bash
# Add console.log in backend
# Logs appear via: make logs-backend

# Add console.log in frontend
# Logs appear via: make logs-frontend or browser console

# Use debugger
make shell-backend
# Install node-inspect if needed
```

### Database Inspection
```bash
# Open MongoDB shell
make shell-db

# Common queries
db.users.find().pretty()
db.habits.countDocuments()
db.habitentries.find({date: ISODate("2026-08-12")})

# Create indexes
db.habits.createIndex({userId: 1, active: 1})
```

### Testing Changes
```bash
# Run tests
make test

# Or individually
make test-backend
make test-frontend

# Watch mode (inside container)
make shell-backend
npm test -- --watch
```

## 🔄 Update Workflow

### Updating Dependencies
```bash
# Update package.json in backend or frontend
# Then rebuild
make rebuild
```

### Pulling New Changes (Git)
```bash
# Pull latest code
git pull

# Rebuild images with new code
make rebuild

# Or just restart if no dependencies changed
make restart
```

## 🚀 Advanced Usage

### Multiple Environments
```bash
# Development
docker-compose up -d

# Staging
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Scaling Services
```bash
# Run multiple backend instances
docker-compose up -d --scale backend=3

# Load balance with nginx
```

### Custom Networks
```bash
# Connect to external services
docker network create external-net
docker network connect external-net mindset-backend
```

### Resource Limits
Add to docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

## 📦 Backup & Recovery

### Full System Backup
```bash
# Backup database
make db-backup

# Backup environment
cp .env .env.backup

# Backup volumes
docker run --rm \
  -v mindset_mongodb_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/volumes-$(date +%Y%m%d).tar.gz /data
```

### Full System Restore
```bash
# Restore database
make db-restore BACKUP_DIR=./backups/backup-20260812-105930/mindset

# Restore environment
cp .env.backup .env

# Restart
make restart
```

## 🎓 Learning Resources

- **Docker Docs**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Makefile Tutorial**: https://makefiletutorial.com/
- **MongoDB in Docker**: https://hub.docker.com/_/mongo

## ✅ Best Practices

1. **Always use Makefile commands** - They include proper error handling
2. **Check health before testing** - `make health` ensures everything is ready
3. **Backup before major changes** - `make db-backup` is quick
4. **Use `.env` for secrets** - Never commit sensitive data
5. **Monitor logs during development** - `make logs` catches issues early
6. **Clean up regularly** - `make prune` frees disk space

---

**Your MindSet app is now fully Dockerized!** 🎉

Run `make quick-start` to begin!
