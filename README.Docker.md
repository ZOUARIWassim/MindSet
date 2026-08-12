# MindSet - Docker Quick Reference

## 🚀 Super Quick Start (3 Commands)

```bash
cd /home/wassim/Desktop/Wassim_Zephyrus/mindset

# Option 1: Everything at once
make quick-start

# Option 2: Step by step
make build    # Build images
make dev      # Start containers
make health   # Check everything works
```

**Done!** Open http://localhost:3000

## 📋 Most Used Commands

```bash
make dev      # Start development
make stop     # Stop everything
make logs     # See what's happening
make health   # Check if everything is OK
make restart  # Restart everything
make clean    # Stop and remove data
```

## 🐳 What Gets Created

**3 Docker Containers:**
- `mindset-mongodb` - Database (port 27017)
- `mindset-backend` - API Server (port 5000)
- `mindset-frontend` - Web App (port 3000)

**2 Docker Volumes:**
- `mongodb_data` - Database storage
- `mongodb_config` - Database configuration

**1 Docker Network:**
- `mindset-network` - Connects all containers

## 🔍 Checking Status

```bash
# Are containers running?
make ps

# Are services healthy?
make health

# What's in the logs?
make logs

# Watch logs live
make logs-backend   # Backend only
make logs-frontend  # Frontend only
```

## 🐛 Debugging

```bash
# Something not working?
make logs           # Check logs first

# Access container shell
make shell-backend  # Backend container
make shell-db       # MongoDB shell

# Start fresh
make rebuild        # Clean rebuild
```

## 💾 Database

```bash
# Backup database
make db-backup

# View data
make shell-db
> db.users.find()
> db.habits.find()

# Reset database (deletes all!)
make db-reset
```

## 🏭 Production

```bash
# Build for production
make prod-build

# Run production
make prod

# Stop production
make prod-stop
```

## 🛑 Stopping

```bash
make stop       # Stop containers (keep data)
make clean      # Stop and remove data
make clean-all  # Remove everything including images
```

## ❓ Need Help?

```bash
make help       # Show all commands
make info       # Show system info
make ports      # Show port mappings
```

## 📚 Full Documentation

- **Complete Guide**: See `DOCKER_GUIDE.md`
- **Project README**: See `README.md`
- **Quick Start**: See `QUICKSTART.md`

---

**That's it!** You're ready to use MindSet with Docker! 🎉
