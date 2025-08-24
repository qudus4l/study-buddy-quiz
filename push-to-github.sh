#!/bin/bash

# Study Buddy Quiz App - GitHub Push Script
echo "📚 Study Buddy Quiz - GitHub Setup"
echo "=================================="
echo ""

# Check if remote already exists
if git remote | grep -q origin; then
    echo "Remote 'origin' already exists. Pushing to GitHub..."
    git push -u origin master
else
    echo "Please follow these steps:"
    echo ""
    echo "1. Go to GitHub.com and sign in to your account"
    echo ""
    echo "2. Click the '+' icon in the top right and select 'New repository'"
    echo ""
    echo "3. Repository settings:"
    echo "   - Name: study-buddy-quiz"
    echo "   - Description: Interactive quiz app that transforms PDF/DOCX files into quizzes"
    echo "   - Keep it Public or Private (your choice)"
    echo "   - DO NOT initialize with README (we already have one)"
    echo "   - Click 'Create repository'"
    echo ""
    echo "4. After creating, GitHub will show you commands. Come back here and enter your GitHub username:"
    read -p "GitHub username: " username
    
    if [ -z "$username" ]; then
        echo "Username cannot be empty. Exiting."
        exit 1
    fi
    
    # Add the remote
    echo ""
    echo "Adding remote repository..."
    git remote add origin "https://github.com/$username/study-buddy-quiz.git"
    
    # Push to GitHub
    echo "Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    
    echo ""
    echo "✅ Success! Your project is now on GitHub!"
    echo ""
    echo "🔗 Your repository URL:"
    echo "https://github.com/$username/study-buddy-quiz"
    echo ""
    echo "📱 You can now access your quiz app from any device by:"
    echo "1. Cloning the repo: git clone https://github.com/$username/study-buddy-quiz.git"
    echo "2. Running: npm install"
    echo "3. Starting: npm start"
fi
