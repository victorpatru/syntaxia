#!/bin/bash

echo "🔧 Setting up Convex API Types Automation..."

# Check if we're in the project root
if [ ! -d ".git" ]; then
    echo "❌ Error: This script must be run from the project root directory"
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy the pre-commit hook
if [ -f ".git/hooks/pre-commit.sample" ]; then
    cp .git/hooks/pre-commit.sample .git/hooks/pre-commit
    echo "✅ Copied pre-commit hook template"
else
    echo "⚠️  Pre-commit sample not found, creating hook from scratch..."
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

echo "Pre-commit hook: Generating Convex API types..."

# Change to the backend package directory
cd packages/backend

# Run the API generation
bun run generate-api

# Check if api.ts was modified
if git diff --name-only --cached | grep -q "packages/backend/api.ts"; then
    echo "API types updated, adding to commit..."
    git add packages/backend/api.ts
fi

echo "Pre-commit hook completed."
EOF
fi

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
