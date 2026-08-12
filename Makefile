.PHONY: help build start stop restart logs clean dev prod ps shell-backend shell-frontend shell-db test install health

# Default target
.DEFAULT_GOAL := help

# Colors for output
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(CYAN)MindSet - Docker Management$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# Development Commands
dev: ## Start development environment (with hot reload)
	@echo "$(GREEN)Starting MindSet in development mode...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Development environment started!$(NC)"
	@echo "$(YELLOW)Frontend:$(NC) http://localhost:3000"
	@echo "$(YELLOW)Backend:$(NC)  http://localhost:5000"
	@echo "$(YELLOW)MongoDB:$(NC)  localhost:27017"
	@echo ""
	@echo "$(CYAN)Run 'make logs' to see output$(NC)"

start: dev ## Alias for 'dev' - Start development environment

build: ## Build all Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	docker-compose build
	@echo "$(GREEN)✓ Build complete!$(NC)"

stop: ## Stop all containers
	@echo "$(YELLOW)Stopping all containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Containers stopped$(NC)"

restart: stop start ## Restart all containers

# Production Commands
prod: ## Start production environment
	@echo "$(GREEN)Starting MindSet in production mode...$(NC)"
	docker-compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)✓ Production environment started!$(NC)"
	@echo "$(YELLOW)Frontend:$(NC) http://localhost"
	@echo "$(YELLOW)Backend:$(NC)  http://localhost:5000"

prod-build: ## Build production images
	@echo "$(GREEN)Building production Docker images...$(NC)"
	docker-compose -f docker-compose.prod.yml build
	@echo "$(GREEN)✓ Production build complete!$(NC)"

prod-stop: ## Stop production environment
	@echo "$(YELLOW)Stopping production containers...$(NC)"
	docker-compose -f docker-compose.prod.yml down
	@echo "$(GREEN)✓ Production containers stopped$(NC)"

# Logs and Monitoring
logs: ## Show logs from all containers
	docker-compose logs -f

logs-backend: ## Show backend logs only
	docker-compose logs -f backend

logs-frontend: ## Show frontend logs only
	docker-compose logs -f frontend

logs-db: ## Show MongoDB logs only
	docker-compose logs -f mongodb

ps: ## Show running containers
	@echo "$(CYAN)MindSet Containers:$(NC)"
	@docker-compose ps

health: ## Check health of all services
	@echo "$(CYAN)Checking service health...$(NC)"
	@echo ""
	@echo "$(YELLOW)MongoDB:$(NC)"
	@curl -s http://localhost:27017 > /dev/null 2>&1 && echo "  $(GREEN)✓ Running$(NC)" || echo "  $(RED)✗ Not responding$(NC)"
	@echo ""
	@echo "$(YELLOW)Backend API:$(NC)"
	@curl -s http://localhost:5000/health | grep -q "OK" && echo "  $(GREEN)✓ Healthy$(NC)" || echo "  $(RED)✗ Unhealthy$(NC)"
	@curl -s http://localhost:5000/health 2>/dev/null
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@curl -s http://localhost:3000 > /dev/null 2>&1 && echo "  $(GREEN)✓ Running$(NC)" || echo "  $(RED)✗ Not responding$(NC)"
	@echo ""

# Shell Access
shell-backend: ## Open shell in backend container
	docker exec -it mindset-backend sh

shell-frontend: ## Open shell in frontend container
	docker exec -it mindset-frontend sh

shell-db: ## Open MongoDB shell
	docker exec -it mindset-mongodb mongosh mindset

# Database Commands
db-backup: ## Backup MongoDB database
	@echo "$(GREEN)Backing up database...$(NC)"
	@mkdir -p backups
	docker exec mindset-mongodb mongodump --db mindset --out /tmp/backup
	docker cp mindset-mongodb:/tmp/backup ./backups/backup-$(shell date +%Y%m%d-%H%M%S)
	@echo "$(GREEN)✓ Backup complete!$(NC)"

db-restore: ## Restore MongoDB database (requires BACKUP_DIR variable)
	@echo "$(YELLOW)Restoring database from $(BACKUP_DIR)...$(NC)"
	@if [ -z "$(BACKUP_DIR)" ]; then echo "$(RED)Error: BACKUP_DIR not set$(NC)"; exit 1; fi
	docker cp $(BACKUP_DIR) mindset-mongodb:/tmp/restore
	docker exec mindset-mongodb mongorestore --db mindset /tmp/restore
	@echo "$(GREEN)✓ Database restored!$(NC)"

db-reset: ## Reset database (WARNING: deletes all data)
	@echo "$(RED)WARNING: This will delete all data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker exec mindset-mongodb mongosh mindset --eval "db.dropDatabase()"; \
		echo "$(GREEN)✓ Database reset complete$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled$(NC)"; \
	fi

# Cleanup Commands
clean: stop ## Stop containers and remove volumes
	@echo "$(YELLOW)Removing containers and volumes...$(NC)"
	docker-compose down -v
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

clean-all: ## Remove everything (containers, volumes, images)
	@echo "$(RED)Removing all MindSet Docker resources...$(NC)"
	docker-compose down -v --rmi all
	@echo "$(GREEN)✓ All resources removed$(NC)"

prune: ## Clean up Docker system
	@echo "$(YELLOW)Cleaning up Docker system...$(NC)"
	docker system prune -f
	@echo "$(GREEN)✓ Docker cleanup complete$(NC)"

# Installation
install: ## Install dependencies (for local development)
	@echo "$(GREEN)Installing backend dependencies...$(NC)"
	cd backend && npm install
	@echo "$(GREEN)Installing frontend dependencies...$(NC)"
	cd frontend && npm install
	@echo "$(GREEN)✓ Dependencies installed!$(NC)"

# Testing
test-backend: ## Run backend tests
	docker-compose exec backend npm test

test-frontend: ## Run frontend tests
	docker-compose exec frontend npm test

test: test-backend test-frontend ## Run all tests

# Quick Actions
quick-start: build dev health ## Build, start, and check health
	@echo ""
	@echo "$(GREEN)🚀 MindSet is ready!$(NC)"
	@echo "$(CYAN)Open http://localhost:3000 to get started$(NC)"

status: ps health ## Show status of all services

# Update and Maintenance
update: ## Pull latest images and restart
	@echo "$(GREEN)Pulling latest images...$(NC)"
	docker-compose pull
	@echo "$(GREEN)Restarting services...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Update complete!$(NC)"

rebuild: clean build dev ## Clean rebuild everything

# Development helpers
watch-backend: ## Watch backend logs with colored output
	docker-compose logs -f backend | grep --color=auto -E "ERROR|WARN|INFO|$$"

watch-frontend: ## Watch frontend logs with colored output
	docker-compose logs -f frontend | grep --color=auto -E "ERROR|WARN|$$"

# Information
info: ## Show environment information
	@echo "$(CYAN)MindSet Environment Information$(NC)"
	@echo ""
	@echo "$(YELLOW)Docker Version:$(NC)"
	@docker --version
	@echo ""
	@echo "$(YELLOW)Docker Compose Version:$(NC)"
	@docker-compose --version
	@echo ""
	@echo "$(YELLOW)Images:$(NC)"
	@docker images | grep mindset
	@echo ""
	@echo "$(YELLOW)Volumes:$(NC)"
	@docker volume ls | grep mindset
	@echo ""

ports: ## Show port mappings
	@echo "$(CYAN)MindSet Port Mappings:$(NC)"
	@echo "  $(GREEN)Frontend:$(NC)  3000 → http://localhost:3000"
	@echo "  $(GREEN)Backend:$(NC)   5000 → http://localhost:5000"
	@echo "  $(GREEN)MongoDB:$(NC)   27017 → mongodb://localhost:27017"
