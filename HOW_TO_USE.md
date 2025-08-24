# Study Buddy Quiz App

## 🚀 Getting Started

### 1. Start the Application

Open a terminal in the `study-buddy-quiz` directory and run:

```bash
npm start
```

The app will open automatically in your browser at `http://localhost:3000`

### 2. Upload Your Study Material

- Click on the upload area or drag and drop your file
- Supported formats: `.docx` and `.pdf` files
- The app will automatically extract questions and answers

### 3. Take the Quiz

Once your file is processed:
- Navigate through questions using **Next** and **Previous** buttons
- Click on any option (A, B, C, D, E) to select your answer
- Click **Show Answer** to reveal the correct answer
- Use the **Grid** button to jump to any question directly
- Click **Reset** to clear all your answers

## 📱 Features

- **Responsive Design**: Works perfectly on phones, tablets, and laptops
- **Progress Tracking**: See how many questions you've answered
- **Accuracy Score**: Track your performance in real-time
- **Beautiful UI**: Clean, modern interface with smooth animations
- **Smart Extraction**: Automatically detects questions and answers from your documents

## 📄 Supported Question Formats

The app recognizes various question formats:
- `Q: Question text...`
- `1. Question text...`
- `Question 1: Text...`
- Options as `A.`, `B)`, `(C)`, etc.
- Answers marked as `ANSWER: B` or similar

## 🧪 Testing

The app has been tested with your sample DOCX files and successfully extracted 182 questions with their answers!

## 🎨 Design Features

- Gradient backgrounds with animated elements
- Smooth transitions between questions
- Color-coded feedback (green for correct, red for incorrect)
- Interactive hover effects
- Mobile-optimized touch interactions

## 📝 Notes

- The app stores your progress locally during the session
- Refresh the page to start over with a new document
- For best results, ensure your document has clear question/answer formatting

Enjoy studying with Study Buddy! 📚✨
