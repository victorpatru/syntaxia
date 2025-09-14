#!/bin/bash

# Enable strict mode for robust error handling
set -euo pipefail
IFS=$'\n\t'

echo "🔧 Setting up Convex API Types Automation..."

# Check if we're in the project root
if [ ! -d ".git" ]; then
    echo "❌ Error: This script must be run from the project root directory"
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Create our custom pre-commit hook (always overwrite with Convex code)
echo "✅ Setting up Convex API generation hook..."
cat > .git/hooks/pre-commit << 'EOF'
#!/usr/bin/env bash

# Enable fail-fast mode
set -euo pipefail

echo "Pre-commit hook: Generating Convex API types..."

# Change to repository root and run generator with correct working directory
cd "$(git rev-parse --show-toplevel)"
bun run -C packages/backend generate-api

# Check if api.ts was modified in working tree (not staged index)
if git diff --name-only -- packages/backend/api.ts | grep -q "packages/backend/api.ts"; then
    echo "API types updated, adding to commit..."
    git add packages/backend/api.ts
fi

echo "Pre-commit hook completed."
EOF

# Make the hook executable
chmod +x .git/hooks/pre-commit
echo "✅ Made pre-commit hook executable"

# Test the hook
echo "🧪 Testing pre-commit hook..."
if [ -x ".git/hooks/pre-commit" ]; then
    echo "✅ Pre-commit hook is properly configured!"
    echo ""
    echo "📝 What this does:"
    echo "  • Generates fresh Convex API types before each commit"
    echo "  • Ensures type safety across your repositories"
    echo "  • Prevents stale types from being committed"
    echo ""
    echo "🚀 You're all set! Happy coding!"
else
    echo "❌ Error: Pre-commit hook setup failed"
    exit 1
fi
