# Portfolio Website with AI Chat

A modern portfolio website built with Next.js, Sanity CMS, and featuring an AI-powered chat assistant.

## ✨ Features

- 🎨 Modern, responsive design
- 📝 Content management with Sanity CMS
- 🤖 **AI Chat Assistant** powered by Google Gemini
- 💬 Real-time chat with contact collection
- 📊 Chat history tracking
- 🌙 Dark mode support
- ⚡ Built with Next.js 16 and React 19

## 🤖 AI Chat Feature

The site includes an intelligent chat assistant that can answer questions about your skills, experience, and services. The AI is powered by Google's Gemini model and has full context about your CV/portfolio.

### Key Features:
- Floating chat button in the bottom-right corner
- Contact information collection before chat starts
- AI responses based on your actual CV data
- Full conversation history saved to Sanity CMS
- Customizable AI personality and prompts

### Quick Setup:
- See [QUICK_START_AI_CHAT.md](./QUICK_START_AI_CHAT.md) for testing instructions
- See [AI_CHAT_SETUP.md](./AI_CHAT_SETUP.md) for complete documentation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Sanity account and project
- Google AI API key (for chat feature)

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in your values
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)
6. Access Sanity Studio at [http://localhost:3000/studio](http://localhost:3000/studio)

## 📚 Documentation

- [Quick Start: AI Chat](./QUICK_START_AI_CHAT.md) - Test the AI chat feature
- [AI Chat Setup Guide](./AI_CHAT_SETUP.md) - Complete AI chat documentation

## 🔒 Security

- Never commit `.env.local` or any file containing secrets
- Use environment variables for all sensitive data
- The AI chat API route runs server-side only
