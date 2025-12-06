# Makefile for supakone.me
# This file provides convenient commands for common tasks

# Default target
.PHONY: all
all: help

# Help target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make resume     - Generate PDF resume from resume.json"
	@echo "  make build      - Build the Astro site"
	@echo "  make dev        - Start development server"
	@echo "  make test       - Run Playwright tests"
	@echo "  make format     - Format code with Prettier"
	@echo "  make check      - Run Astro type checking"

# Generate PDF resume
.PHONY: resume
resume:
	@echo "📄 Generating PDF Resume..."
	cd docs && pnpm run generate:resume

# Build the site
.PHONY: build
build:
	@echo "🔨 Building site..."
	cd docs && pnpm run build

# Start development server
.PHONY: dev
dev:
	@echo "🚀 Starting development server..."
	cd docs && pnpm run dev

# Run tests
.PHONY: test
test:
	@echo "🧪 Running tests..."
	cd docs && pnpm run test

# Format code
.PHONY: format
format:
	@echo "✨ Formatting code..."
	cd docs && pnpm run format

# Type checking
.PHONY: check
check:
	@echo "🔍 Running type checks..."
	cd docs && pnpm exec astro check
