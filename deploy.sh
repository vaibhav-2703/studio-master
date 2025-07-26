#!/bin/bash

# SnipURL Deployment Setup Script
# This script helps you set up and deploy SnipURL to production

set -e

echo "🚀 SnipURL Deployment Setup"
echo "=========================="

# Check if required tools are installed
check_tools() {
    echo "📋 Checking required tools..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is required. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is required. Please install npm"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git is required. Please install Git"
        exit 1
    fi
    
    echo "✅ All required tools are installed"
}

# Install Vercel CLI
install_vercel() {
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
}

# Setup environment
setup_env() {
    echo "🔧 Setting up environment..."
    
    if [ ! -f ".env.local" ]; then
        echo "📄 Creating .env.local from template..."
        cp .env.example .env.local
        echo "⚠️  Please edit .env.local with your actual values before deploying"
    else
        echo "✅ .env.local already exists"
    fi
}

# Build and test
build_test() {
    echo "🔨 Building and testing..."
    
    echo "📦 Installing dependencies..."
    npm ci
    
    echo "🔍 Running type check..."
    npm run type-check
    
    echo "🏗️  Building application..."
    npm run build
    
    echo "✅ Build successful"
}

# Initialize Git repository
setup_git() {
    echo "📚 Setting up Git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        git add .
        git commit -m "Initial commit - SnipURL deployment ready"
        echo "✅ Git repository initialized"
    else
        echo "✅ Git repository already exists"
    fi
}

# Deploy to Vercel
deploy_vercel() {
    echo "🚀 Deploying to Vercel..."
    
    echo "🔐 Login to Vercel (browser will open)..."
    vercel login
    
    echo "📤 Deploying to production..."
    vercel --prod
    
    echo "✅ Deployment complete!"
}

# Main execution
main() {
    echo "Starting deployment setup..."
    
    check_tools
    install_vercel
    setup_env
    build_test
    setup_git
    
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env.local with your actual values"
    echo "2. Create a Supabase project at https://supabase.com"
    echo "3. Push your code to GitHub"
    echo "4. Run this script again to deploy to Vercel"
    echo ""
    
    read -p "Would you like to deploy to Vercel now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_vercel
    else
        echo "You can deploy later by running: vercel --prod"
    fi
}

# Run main function
main
