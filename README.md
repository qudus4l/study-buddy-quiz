# Study Buddy Quiz

<div align="center">
  
  ![Study Buddy Quiz Logo](https://img.shields.io/badge/Study%20Buddy-Quiz%20App-blue?style=for-the-badge)
  ![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?style=flat-square&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)
  ![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai)
  
  **Transform your study materials into interactive, AI-powered quizzes**
  
  [Demo](https://study-buddy-quiz.vercel.app) · [Report Bug](https://github.com/yourusername/study-buddy-quiz/issues) · [Request Feature](https://github.com/yourusername/study-buddy-quiz/issues)

</div>

## 📖 Overview

Study Buddy Quiz is a modern web application that converts your study documents (PDF/DOCX) into interactive quizzes with AI-powered explanations. Built with React and TypeScript, it features a beautiful UI, smart document parsing, and OpenAI integration for personalized learning assistance.

## ✨ Key Features

- **📄 Smart Document Parser** - Automatically extracts questions and answers from PDF/DOCX files
- **🤖 AI-Powered Learning** - Get personalized explanations and hints powered by OpenAI
- **🎲 Dual Randomization** - Shuffle both question order and answer positions for better learning
- **📊 Progress Tracking** - Real-time accuracy calculation and study time monitoring
- **💾 Local Persistence** - Saves your progress automatically
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **⌨️ Keyboard Shortcuts** - Navigate efficiently with keyboard controls
- **🎨 Modern UI** - Beautiful animations and transitions with Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/study-buddy-quiz.git
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
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   The app will open at http://localhost:3000

## 🎯 Usage

### Basic Workflow

1. **Upload Document** - Drag and drop or browse for a DOCX/PDF file containing questions
2. **Configure Options** - Toggle randomization settings before starting
3. **Take Quiz** - Answer questions, get instant feedback
4. **Review & Learn** - View explanations for incorrect answers
5. **Track Progress** - Monitor accuracy and study time

### Supported Document Formats

The parser recognizes various question formats:
- Questions starting with `Q:` or numbered (1., 2., etc.)
- Multiple choice options as `A.`, `B)`, `(C)`, etc.
- Answers marked as `ANSWER: B` or similar patterns

### Keyboard Shortcuts

- `←` / `→` - Navigate between questions
- `A-E` - Select answer options
- `Space` - Show/hide answer
- `G` - Open grid navigation
- `R` - Reshuffle questions

## 🏗️ Architecture

### Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Document Parsing**: Mammoth.js for DOCX
- **AI Integration**: OpenAI API
- **State Management**: React Hooks + Local Storage
- **Build Tool**: Create React App
- **Deployment**: Vercel

### Project Structure

```
study-buddy-quiz/
├── src/
│   ├── components/        # React components
│   │   ├── FileUpload.tsx
│   │   ├── QuizView.tsx
│   │   ├── QuizQuestion.tsx
│   │   └── QuizNavigation.tsx
│   ├── services/          # External services
│   │   └── openaiService.ts
│   ├── utils/             # Utility functions
│   │   ├── documentParser.ts
│   │   ├── randomizeOptions.ts
│   │   └── shuffleArray.ts
│   ├── hooks/             # Custom React hooks
│   │   └── useLocalStorage.ts
│   ├── types/             # TypeScript definitions
│   │   └── quiz.ts
│   └── App.tsx            # Main application
├── public/                # Static assets
└── package.json          # Dependencies
```

## 🚢 Deployment

### Deploy to Vercel

1. **Fork this repository**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - Configure environment variables

3. **Environment Setup**
   ```
   REACT_APP_OPENAI_API_KEY = your_openai_api_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-app.vercel.app`

For detailed deployment instructions, see [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🧪 Development

### Available Scripts

```bash
npm start       # Start development server
npm run build   # Create production build
npm test        # Run test suite
npm run eject   # Eject from Create React App (one-way operation)
```

### API Configuration

The app uses OpenAI's GPT model for generating explanations. Configure your API key in the `.env` file:

```env
REACT_APP_OPENAI_API_KEY=sk-...
```

API calls are optimized to only generate explanations for incorrect answers, reducing costs.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT API
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) for DOCX parsing
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide React](https://lucide.dev) for icons

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<div align="center">
  Made with ❤️ by the Study Buddy Team
</div>