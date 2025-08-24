# 🚀 Push to GitHub - Quick Setup

## Option 1: Automated Script (Recommended)

Run this command in your terminal:
```bash
./push-to-github.sh
```

Then follow the prompts.

## Option 2: Manual Setup

### Step 1: Create a GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Fill in:
   - **Repository name:** `study-buddy-quiz`
   - **Description:** Interactive quiz app that transforms PDF/DOCX files into quizzes
   - **Public/Private:** Your choice
   - **DO NOT** check "Initialize with README"
4. Click **Create repository**

### Step 2: Push Your Code
After creating the repository, run these commands (replace YOUR_USERNAME):

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/study-buddy-quiz.git

# Rename branch to main (GitHub's default)
git branch -M main

# Push your code
git push -u origin main
```

## 📎 Your Repository Link

After pushing, your repository will be available at:
```
https://github.com/YOUR_USERNAME/study-buddy-quiz
```

## 🎉 Share Your App!

Once pushed, you can:
- Share the link with others
- Deploy to GitHub Pages, Vercel, or Netlify
- Clone it on any device to study anywhere

---

Need help? The code is already committed and ready to push!
