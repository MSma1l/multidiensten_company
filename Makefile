# Production operations for the Multidiensten stack.
# All targets drive docker-compose.prod.yml. Run from the repo root.

COMPOSE := docker compose -f docker-compose.prod.yml

.DEFAULT_GOAL := help

.PHONY: help preflight build up down restart logs ps backup restore certs deploy

help: ## Show this help
	@echo "Multidiensten — production make targets"
	@echo ""
	@echo "  make preflight   Validate .env before deploying"
	@echo "  make build       Build all images"
	@echo "  make up          Build and start the stack (detached)"
	@echo "  make down        Stop the stack (keeps volumes/data)"
	@echo "  make restart     Restart all services"
	@echo "  make logs        Follow logs for all services"
	@echo "  make ps          Show service status"
	@echo "  make backup      Dump the database to ./backups/"
	@echo "  make restore     Restore a dump: make restore FILE=backups/<file>"
	@echo "  make certs       Issue the first Let's Encrypt certificate"
	@echo "  make deploy      preflight -> build -> up"

preflight: ## Validate the root .env
	bash deploy/preflight.sh

build: ## Build all images
	$(COMPOSE) build

up: ## Build and start the stack (detached)
	$(COMPOSE) up -d --build

down: ## Stop the stack (keeps volumes)
	$(COMPOSE) down

restart: ## Restart all services
	$(COMPOSE) restart

logs: ## Follow logs for all services
	$(COMPOSE) logs -f

ps: ## Show service status
	$(COMPOSE) ps

backup: ## Dump the database to ./backups/
	bash deploy/backup-db.sh

restore: ## Restore a dump (FILE=backups/<file>)
	bash deploy/restore-db.sh $(FILE)

certs: ## Issue the first Let's Encrypt certificate
	bash deploy/init-letsencrypt.sh

deploy: preflight build up ## Full deploy: preflight -> build -> up
	@echo "Deploy complete. Check: make ps"
