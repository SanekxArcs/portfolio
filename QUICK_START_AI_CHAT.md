# Quick Start: Testing the AI Chat Feature

This is a quick guide to test the AI chat feature locally.

## Prerequisites

You need:
1. A Google AI API key (Gemini)
2. Your Sanity project configured
3. A Sanity API token with write permissions

## Step 1: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Your existing Sanity configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-12-15

# New: Google AI API Key
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# New: Sanity Write Token
SANITY_API_WRITE_TOKEN=your_sanity_write_token_here
```

### Get Google AI API Key
1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy it to your `.env.local`

### Get Sanity Write Token
1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to API > Tokens
4. Create a new token with **Editor** permissions
5. Copy it to your `.env.local`

## Step 2: Configure AI in Sanity Studio

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000/studio

3. You'll see two new content types:
   - **AI Configuration**
   - **Chat History**

4. Create a new **AI Configuration** document:

   **System Prompt** (example):
   ```
   You are an AI assistant representing a talented software developer named [Your Name]. 
   Your goal is to answer questions about their skills, experience, and services in a 
   professional and enthusiastic manner. Always highlight their strengths and try to 
   sell them as a valuable employee or service provider. Be friendly, professional, 
   and persuasive. When discussing their work, emphasize the business value they bring.
   ```

   **Additional Information** (example):
   ```
   - Available for freelance projects and full-time positions
   - Specializes in full-stack web development
   - Expert in React, Next.js, TypeScript, and Node.js
   - 5+ years of professional experience
   - Proven track record of delivering high-quality projects on time
   ```

   **Greeting Message** (example):
   ```
   Hi! 👋 I'm an AI assistant here to answer any questions you have. 
   Feel free to ask me about skills, experience, or availability for projects!
   ```

5. Click **Publish**

## Step 3: Test the Chat

1. Go to http://localhost:3000

2. Look for the floating chat button (💬) in the bottom-right corner

3. Click it to open the chat

4. Fill in at least one contact field:
   - Name: "Test User"
   - Email: "test@example.com"
   - Or Phone: "+1234567890"

5. Click "Start Chat"

6. Try asking questions like:
   - "What are your main skills?"
   - "Tell me about your experience"
   - "What projects have you worked on?"
   - "Are you available for freelance work?"

## Step 4: Verify Chat History

1. Go back to http://localhost:3000/studio

2. Navigate to **Chat History**

3. You should see your test conversation saved with:
   - Your contact information
   - All messages exchanged
   - Timestamps

## Troubleshooting

### Chat button doesn't appear
- Clear browser cache
- Check browser console for errors
- Verify the component is imported in layout.tsx

### "Failed to process chat message"
- Check that `GOOGLE_AI_API_KEY` is set correctly
- Verify the API key is valid
- Check browser console and terminal for detailed errors

### "AI configuration not found"
- Make sure you created and published an AI Configuration in Sanity Studio
- Refresh the page

### Chat history not saving
- Verify `SANITY_API_WRITE_TOKEN` has Editor or Admin permissions
- Check terminal for Sanity API errors

## Next Steps

Once everything works:

1. Customize the AI prompts in Sanity Studio
2. Adjust the chat widget styling in `components/ai-chat-widget.tsx`
3. Monitor real conversations in Sanity Studio
4. Deploy to production with production environment variables

## Production Checklist

Before deploying:

- [ ] Set all environment variables in your hosting platform
- [ ] Test with production Sanity dataset
- [ ] Review AI prompts for production use
- [ ] Consider adding rate limiting to the API route
- [ ] Test on mobile devices
- [ ] Verify GDPR/privacy compliance for chat storage

For detailed documentation, see `AI_CHAT_SETUP.md`.
