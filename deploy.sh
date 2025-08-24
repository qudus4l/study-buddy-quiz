#!/bin/bash

# Study Buddy Quiz - Vercel Deployment Script
echo "🚀 Study Buddy Quiz - Vercel Deployment"
echo "========================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env from example..."
    cp env.example .env
    echo "Please edit .env and add your OpenAI API key"
    echo ""
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📤 Deploying to Vercel..."
    echo ""
    
    # Deploy with Vercel
    vercel --prod
    
    echo ""
    echo "🎉 Deployment complete!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Go to your Vercel dashboard"
    echo "2. Add REACT_APP_OPENAI_API_KEY to environment variables"
    echo "3. Redeploy if needed"
    echo ""
    echo "📚 Full instructions in DEPLOY_TO_VERCEL.md"
else
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi
