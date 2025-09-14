# Development Setup Guide

This guide covers how to set up your development environment for Syntaxia.

## Prerequisites

- Bun (preferred) or Node.js
- Git

## Initial Setup

```bash
# Install dependencies
bun install

# Setup development environment
cd packages/backend && bun run setup
```

## Convex API Types Automation

This project uses automated generation of TypeScript types for Convex functions to ensure type safety across repositories.

### For All Developers (Required)

Run this command to configure your local environment with the pre-commit hook:

```bash
# Automated setup (recommended)
bun run setup-hooks
```

This will:
- Copy the pre-commit hook to your local `.git/hooks/` directory
- Make it executable
- Test that it's working properly
- Provide setup confirmation and usage instructions

### What the Pre-commit Hook Does

- Automatically generates fresh Convex API types before each commit
- Ensures type consistency across the codebase
- Prevents stale types from being committed
- Uses `bunx convex-helpers ts-api-spec` to generate types

### Manual API Generation

If you need to generate types manually during development:

```bash
cd packages/backend
bun run generate-api
```

Or from the project root:
```bash
bun run --filter=@syntaxia/backend generate-api
```

## Development Workflow

### Starting Development Servers

```bash
# Start all development servers
bun run dev

# Start specific services
bun run dev:app      # Main app
bun run dev:web      # Web frontend
```

### Available Scripts

- `bun run build` - Build all packages
- `bun run test` - Run tests
- `bun run lint` - Run linters
- `bun run format` - Format code with Biome
- `bun run typecheck` - Run TypeScript type checking

### Project Structure

```
syntaxia/
├── apps/
│   ├── app/          # Main application (TanStack Router)
│   └── web/          # Marketing website (Astro)
├── packages/
│   ├── backend/      # Convex backend and API
│   ├── shared/       # Shared types and utilities
│   └── ui/           # UI component library
├── scripts/          # Development scripts
└── tooling/          # Build tools and configurations
```

## Troubleshooting

### Pre-commit Hook Issues

- **If the hook isn't working**: Run `bun run setup-hooks` to reconfigure
- **Check hook exists**: Verify `.git/hooks/pre-commit` exists and is executable
- **Permission errors**: Run `chmod +x .git/hooks/pre-commit`
- **Skip temporarily**: Use `git commit --no-verify`
- **Test manually**: Run `cd packages/backend && bun run generate-api`
