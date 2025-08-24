# 📚 Study Buddy Quiz App - AI Enhanced Edition

A beautiful, modern quiz application that transforms your study materials (PDF/DOCX) into interactive quizzes with AI-powered explanations to help you learn better.

## ✅ Issues Fixed

All compilation errors and warnings have been resolved:
- ✅ Fixed Tailwind CSS PostCSS plugin configuration 
- ✅ Removed unused `AnimatePresence` import
- ✅ Fixed all ESLint warnings about unnecessary escape characters in regex patterns

## 🚀 Quick Start

1. **Start the application:**
   ```bash
   npm start
   ```
   The app will open at http://localhost:3000

2. **Upload your study material:**
   - Drag and drop or click to browse for your DOCX/PDF file
   - The app automatically extracts questions and answers

3. **Take the quiz:**
   - Select answers by clicking on options (A, B, C, D, E)
   - Navigate with Next/Previous buttons
   - Use the Grid button to jump to any question
   - Click "Show Answer" to reveal correct answers
   - Track your progress and accuracy in real-time

## ✨ Features

### 🤖 AI-Powered Learning (NEW!)
- **Smart Explanations**: When you reveal answers, GPT provides personalized explanations for why answers are correct or incorrect
- **Study Tips**: Get AI-generated study tips for each question to reinforce learning
- **Hint System**: Request hints before answering to guide your thinking

### 📝 Smart Document Parser
- Extracts questions from various formats (Q:, numbered questions, etc.)
- Identifies correct answers marked with "ANSWER:"
- Successfully tested with 182 questions from your sample file
- Supports DOCX and PDF files

### 🎨 Enhanced UX Features
- **Study Timer**: Track how long you've been studying
- **Streak Counter**: Build momentum with correct answer streaks 🔥
- **Sound Effects**: Audio feedback for correct/incorrect answers (can be muted)
- **Keyboard Shortcuts**: Navigate with arrow keys, press G for grid view
- **Progress Persistence**: Your answers are saved locally
- **Motivational Messages**: Dynamic encouragement based on performance
- **Visual Feedback**: Beautiful animations and transitions

### 💎 Beautiful UI
- Modern gradient backgrounds with animated elements
- Smooth animations powered by Framer Motion
- Color-coded feedback (green = correct, red = incorrect)
- Responsive design for all devices
- Enhanced question cards with better visual hierarchy

### 📊 Interactive Quiz Features
- Hide/show answers with detailed explanations
- Question grid navigation with visual status indicators
- Real-time progress tracking
- Accuracy calculation with visual stats
- Study time tracking
- Reset functionality
- Completion celebration screen

## 📱 Mobile & Desktop Ready

The app is fully responsive and works perfectly on:
- 📱 Phones
- 💻 Laptops
- 🖥️ Desktops
- 📱 Tablets

## 🧪 Tested With Your Files

Successfully tested with:
- ✅ "FBA420 CSR Exam Q&A ✅.docx" - Extracted all 182 questions with answers
- ✅ "SHIT.docx" - Ready to test

## 🛠️ Technical Stack

- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Mammoth for DOCX parsing
- OpenAI API for AI explanations
- Local Storage for progress persistence
- Responsive design

## 🔐 Environment Setup

The app uses OpenAI's API for generating explanations. The API key is stored in `.env` file:

```bash
REACT_APP_OPENAI_API_KEY=your_api_key_here
```

**Note**: The `.env` file is already configured and gitignored for security.

## 📄 Supported Formats

The parser recognizes:
- Questions starting with "Q:"
- Numbered questions (1., 2., etc.)
- Options as A., B), (C), etc.
- Answers marked as "ANSWER: B"

---

Enjoy studying with Study Buddy! 🎓✨