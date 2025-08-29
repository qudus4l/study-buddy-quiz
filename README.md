# 📚 Study Buddy Quiz

An intelligent quiz application that transforms your study materials into interactive quizzes with AI-powered explanations. Upload PDF or DOCX files and start practicing immediately!

## ✨ Features

- **📄 Document Upload**: Support for PDF and DOCX files
- **🎯 Smart Question Parsing**: Automatically extracts questions and answers from various formats
  - Standard numbered questions (1., 2., 3.)
  - Q-format questions (Q1., Q2., Q3.)
  - Bolded answers in DOCX files
  - Answer key sections
- **🤖 AI-Powered Explanations**: Get detailed explanations for any question using OpenAI
- **📊 Progress Tracking**: Monitor your quiz performance and review history
- **🎨 Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **💾 Local Storage**: Your quiz progress is automatically saved
- **🔀 Smart Randomization**: Questions and answer options can be shuffled for better practice

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Document Processing**: 
  - `mammoth` for DOCX parsing
  - `pdfjs-dist` for PDF parsing
- **AI Integration**: OpenAI API for explanations
- **Deployment**: Vercel
- **State Management**: React Hooks with localStorage persistence

## 📋 Prerequisites

- Node.js 14+ and npm
- OpenAI API key (for AI explanations feature)
- Git (for version control)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/qudus4l/study-buddy-quiz.git
   cd study-buddy-quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` and add your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   The app will open at [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### OpenAI API Setup

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file as shown above
3. The app uses GPT-3.5-turbo by default for cost-effectiveness

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_OPENAI_API_KEY` | Your OpenAI API key | Yes (for explanations) |

## 📖 Usage Guide

### Uploading Documents

1. Click the "Upload Document" button on the home page
2. Select a PDF or DOCX file containing quiz questions
3. Wait for the file to be processed
4. Start taking the quiz!

### Document Format Requirements

The app supports various question formats:

#### Standard Format
```
1. What is the capital of France?
A. London
B. Paris
C. Berlin
D. Madrid

Answer: B
```

#### Q-Format (with bolded answers in DOCX)
```
Q1. What is React?
A. A database
**B. A JavaScript library**
C. A programming language
D. An operating system
```

#### With Answer Key Section
```
Questions:
1. Question text...
2. Question text...

Answer Key:
1. B
2. C
```

### Taking Quizzes

- **Navigate**: Use Previous/Next buttons or keyboard shortcuts
- **Submit Answer**: Click on an option to select it
- **Get Explanation**: Click "Explain" for AI-powered explanations
- **Review**: Check your answers after completing the quiz
- **Retry**: Reset and take the quiz again with shuffled questions

## 🌐 Deployment

### Deploy to Vercel

1. **Fork this repository** to your GitHub account

2. **Sign up/Login** to [Vercel](https://vercel.com)

3. **Import the project**:
   - Click "New Project"
   - Import your forked repository
   - Configure environment variables in Vercel dashboard

4. **Deploy**: Vercel will automatically build and deploy your app

### Manual Deployment

```bash
# Build for production
npm run build

# The build folder is ready to be deployed
# You can serve it with any static hosting service
```

## 🏗️ Project Structure

```
study-buddy-quiz/
├── public/             # Static files
├── src/
│   ├── components/     # React components
│   │   ├── FileUpload.tsx
│   │   ├── QuizNavigation.tsx
│   │   ├── QuizQuestion.tsx
│   │   └── QuizView.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useLocalStorage.ts
│   ├── services/       # External service integrations
│   │   └── openaiService.ts
│   ├── types/          # TypeScript type definitions
│   │   └── quiz.ts
│   ├── utils/          # Utility functions
│   │   ├── documentParser.ts
│   │   ├── randomizeOptions.ts
│   │   └── shuffleArray.ts
│   ├── App.tsx         # Main app component
│   └── index.tsx       # App entry point
├── .env.example        # Environment variables template
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vercel.json         # Vercel deployment settings
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
- Ensure all dependencies are installed: `npm install`
- Clear the build cache: `rm -rf node_modules && npm install`

**Questions not parsing correctly**
- Check that your document follows one of the supported formats
- Ensure answers are clearly marked (bolded in DOCX or in answer key)

**OpenAI explanations not working**
- Verify your API key is correctly set in `.env`
- Check your OpenAI account has available credits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Document parsing powered by [Mammoth.js](https://github.com/mwilliamson/mammoth.js) and [PDF.js](https://mozilla.github.io/pdf.js/)
- AI explanations by [OpenAI](https://openai.com)
- Deployed on [Vercel](https://vercel.com)

## 📞 Support

For issues, questions, or suggestions, please [open an issue](https://github.com/qudus4l/study-buddy-quiz/issues) on GitHub.

---

Made with ❤️ for better studying