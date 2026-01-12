# AI Chat Widget Setup Guide

This guide explains how to set up and configure the AI chat widget on your portfolio website.

## Overview

The AI chat widget is a floating chat interface that appears in the bottom-right corner of your website. It uses Google's Gemini AI to answer questions about you and your services, helping to sell you as an employee or your services to potential clients.

## Features

- 🤖 AI-powered chat using Google Gemini
- 💬 Floating chat button in the bottom-right corner
- 📝 Contact information collection before chat
- 💾 Full chat history saved to Sanity CMS
- 🎨 Responsive design matching your website theme
- ⚡ Real-time responses with loading indicators

## Setup Instructions

### 1. Get Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

### 2. Configure Sanity Write Token

1. Go to your Sanity project dashboard at [sanity.io](https://www.sanity.io/manage)
2. Select your project
3. Navigate to **API** > **Tokens**
4. Click **Add New Token**
5. Give it a name (e.g., "Chat History Writer")
6. Set permissions to **Editor** or **Admin** (required for writing chat history)
7. Copy the token immediately (you won't be able to see it again)

### 3. Set Environment Variables

Create a `.env.local` file in the root of your project (or update your existing one) with:

```env
# Google AI (Gemini) API Key
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Sanity API Token with write permissions
SANITY_API_WRITE_TOKEN=your_sanity_write_token_here
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### 4. Configure AI in Sanity Studio

1. Start your development server: `npm run dev`
2. Navigate to `/studio` in your browser
3. You'll see two new content types:
   - **AI Configuration** - Set up your AI's behavior
   - **Chat History** - View saved chat conversations

4. Create a new **AI Configuration** document:
   - **System Prompt**: Main instructions for the AI. Example:
     ```
     You are an AI assistant representing a talented software developer. 
     Your goal is to answer questions about their skills, experience, and services 
     in a professional and enthusiastic manner. Always highlight their strengths 
     and try to sell them as a valuable employee or service provider.
     Be friendly, professional, and persuasive.
     ```
   
   - **Additional Information**: Extra context about you. Example:
     ```
     Available for freelance projects and full-time positions.
     Specializes in full-stack web development with React and Node.js.
     Has 5+ years of experience building scalable web applications.
     ```
   
   - **Greeting Message**: The first message users see. Example:
     ```
     Hi! I'm an AI assistant here to tell you about my services. 
     How can I help you today?
     ```

5. Click **Publish** to save your configuration

### 5. Test the Chat

1. Visit your website
2. Look for the floating chat button (💬) in the bottom-right corner
3. Click it to open the chat dialog
4. Fill in your contact information
5. Start chatting!

## How It Works

### User Flow

1. User clicks the floating chat button
2. A dialog opens requesting contact information (name, email, or phone)
3. User provides at least one contact method
4. Chat interface opens with a greeting message
5. User asks questions about you
6. AI responds based on your CV profile data and AI configuration
7. All messages are saved to Sanity CMS

### Data Flow

1. **User Message** → Frontend sends to `/api/chat`
2. **API Route**:
   - Fetches AI configuration from Sanity
   - Fetches your CV profile for context
   - Sends message to Google Gemini AI
   - Saves conversation to Sanity
3. **AI Response** → Returned to frontend and displayed

### Context Provided to AI

The AI has access to:
- Your name, role, and about section
- Your contact information
- Your skills (frontend, backend, DevOps)
- Your languages
- Recent work experience
- Key projects
- Your system prompt and additional info from Sanity

## Viewing Chat History

1. Go to `/studio` in your browser
2. Navigate to **Chat History**
3. Click on any conversation to view:
   - User contact information
   - Full message history
   - Timestamps for each message
   - Session details

## Customization

### Styling

The chat widget uses your existing UI components and theme. To customize:

- Edit `/components/ai-chat-widget.tsx`
- Modify colors in the component (currently uses cyan/blue gradient)
- Adjust size, position, or animations

### AI Behavior

To change how the AI responds:

1. Go to `/studio`
2. Edit your **AI Configuration** document
3. Update the system prompt to change personality or focus
4. Add more context in the additional information field
5. Publish your changes

### Button Position

To change the floating button position, edit the className in `ai-chat-widget.tsx`:

```tsx
// Current: bottom-right
<div className="fixed bottom-6 right-6 z-50">

// Example: bottom-left
<div className="fixed bottom-6 left-6 z-50">
```

## Troubleshooting

### Chat button not appearing
- Check that the component is imported in `/app/(website)/layout.tsx`
- Clear browser cache and reload

### API errors
- Verify `GOOGLE_AI_API_KEY` is set correctly
- Check `SANITY_API_WRITE_TOKEN` has write permissions
- Check browser console for error messages

### AI not responding correctly
- Review and update your system prompt in Sanity Studio
- Ensure your CV profile is complete in Sanity
- Check that AI configuration is published

### Chat history not saving
- Verify `SANITY_API_WRITE_TOKEN` has Editor or Admin permissions
- Check Sanity Studio for error messages
- Review API route logs in terminal

## Security Notes

- Never expose your API keys in client-side code
- The API route runs server-side only
- Chat history is private and stored securely in Sanity
- Consider rate limiting for production use

## Next Steps

- Monitor chat conversations in Sanity Studio
- Refine your AI prompts based on actual conversations
- Add analytics to track chat engagement
- Consider adding file upload for CV requests
- Implement email notifications for new chats

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Sanity and Google AI documentation
3. Check the project's GitHub issues
