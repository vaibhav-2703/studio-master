# SnipURL Deployment Setup Script for Windows
# This script helps you set up and deploy SnipURL to production

Write-Host "🚀 SnipURL Deployment Setup" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green

# Check if required tools are installed
function Test-Tools {
    Write-Host "📋 Checking required tools..." -ForegroundColor Yellow
    
    if (!(Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Node.js is required. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
        exit 1
    }
    
    if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Host "❌ npm is required. Please install npm" -ForegroundColor Red
        exit 1
    }
    
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Git is required. Please install Git" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ All required tools are installed" -ForegroundColor Green
}

# Install Vercel CLI
function Install-Vercel {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
}

# Setup environment
function Set-Environment {
    Write-Host "🔧 Setting up environment..." -ForegroundColor Yellow
    
    if (!(Test-Path ".env.local")) {
        Write-Host "📄 Creating .env.local from template..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env.local"
        Write-Host "⚠️  Please edit .env.local with your actual values before deploying" -ForegroundColor Magenta
    } else {
        Write-Host "✅ .env.local already exists" -ForegroundColor Green
    }
}

# Build and test
function Build-Test {
    Write-Host "🔨 Building and testing..." -ForegroundColor Yellow
    
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm ci
    
    Write-Host "🔍 Running type check..." -ForegroundColor Yellow
    npm run type-check
    
    Write-Host "🏗️  Building application..." -ForegroundColor Yellow
    npm run build
    
    Write-Host "✅ Build successful" -ForegroundColor Green
}

# Initialize Git repository
function Set-Git {
    Write-Host "📚 Setting up Git repository..." -ForegroundColor Yellow
    
    if (!(Test-Path ".git")) {
        git init
        git add .
        git commit -m "Initial commit - SnipURL deployment ready"
        Write-Host "✅ Git repository initialized" -ForegroundColor Green
    } else {
        Write-Host "✅ Git repository already exists" -ForegroundColor Green
    }
}

# Deploy to Vercel
function Deploy-Vercel {
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
    
    Write-Host "🔐 Login to Vercel (browser will open)..." -ForegroundColor Yellow
    vercel login
    
    Write-Host "📤 Deploying to production..." -ForegroundColor Yellow
    vercel --prod
    
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
}

# Main execution
function Main {
    Write-Host "Starting deployment setup..." -ForegroundColor Cyan
    
    Test-Tools
    Install-Vercel
    Set-Environment
    Build-Test
    Set-Git
    
    Write-Host ""
    Write-Host "🎉 Setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Edit .env.local with your actual values"
    Write-Host "2. Create a Supabase project at https://supabase.com"
    Write-Host "3. Push your code to GitHub"
    Write-Host "4. Run this script again to deploy to Vercel"
    Write-Host ""
    
    $deploy = Read-Host "Would you like to deploy to Vercel now? (y/N)"
    if ($deploy -eq "y" -or $deploy -eq "Y") {
        Deploy-Vercel
    } else {
        Write-Host "You can deploy later by running: vercel --prod" -ForegroundColor Yellow
    }
}

# Run main function
Main
