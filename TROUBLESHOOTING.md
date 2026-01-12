# Troubleshooting Guide - AI Chat Feature

Common issues and their solutions for the AI chat feature.

## Table of Contents

1. [Chat Button Not Appearing](#1-chat-button-not-appearing)
2. [Dialog Won't Open](#2-dialog-wont-open)
3. [Contact Form Issues](#3-contact-form-issues)
4. [API Errors](#4-api-errors)
5. [AI Not Responding](#5-ai-not-responding)
6. [Chat History Not Saving](#6-chat-history-not-saving)
7. [Slow Responses](#7-slow-responses)
8. [Build Errors](#8-build-errors)
9. [Styling Issues](#9-styling-issues)
10. [Mobile Issues](#10-mobile-issues)

---

## 1. Chat Button Not Appearing

### Symptoms
- Floating chat button not visible on the website
- No errors in console

### Possible Causes & Solutions

**A. Component Not Imported**
```typescript
// Check app/(website)/layout.tsx
// Should include:
import {AiChatWidget} from '@/components/ai-chat-widget'

// In JSX:
<AiChatWidget />
```

**B. CSS/Tailwind Issue**
```bash
# Rebuild CSS
npm run dev
# Clear browser cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

**C. Z-Index Conflict**
```typescript
// In ai-chat-widget.tsx, button should have:
className="fixed bottom-6 right-6 z-50"
// Ensure no other elements have higher z-index
```

**D. Browser Extension Blocking**
- Disable ad blockers temporarily
- Try incognito/private mode

---

## 2. Dialog Won't Open

### Symptoms
- Button appears but clicking does nothing
- Console shows errors

### Solutions

**A. Check Console Errors**
```javascript
// Open browser console (F12)
// Look for React errors or JavaScript exceptions
```

**B. State Management Issue**
```typescript
// Verify useState in ai-chat-widget.tsx:
const [isOpen, setIsOpen] = useState(false);

// Button should have:
onClick={() => setIsOpen(true)}
```

**C. Dialog Component Missing**
```bash
# Reinstall dependencies
npm install
```

---

## 3. Contact Form Issues

### Symptoms
- Form won't submit
- Validation not working
- Fields not accepting input

### Solutions

**A. Validation Not Triggering**
```typescript
// In handleContactSubmit:
if (!contactInfo.email && !contactInfo.phone && !contactInfo.name) {
  alert("Please provide at least your email, phone, or name to start chatting.");
  return;
}
```

**B. State Not Updating**
```typescript
// Check onChange handlers:
onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
```

**C. Form Not Hiding After Submit**
```typescript
// After validation passes:
setShowContactForm(false);
```

---

## 4. API Errors

### Symptoms
- Error: "Failed to process chat message"
- Network errors in console
- 500 Internal Server Error

### Solutions

**A. Missing Environment Variables**
```bash
# Check .env.local exists and contains:
GOOGLE_AI_API_KEY=your_key_here
SANITY_API_WRITE_TOKEN=your_token_here

# Restart dev server after adding:
npm run dev
```

**B. Invalid API Key**
```bash
# Test Google AI API key:
curl https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY
```

**Expected Response:**
- Should return API info, not 401 Unauthorized

**C. CORS Issues**
```typescript
// API route should be in app/api/chat/route.ts
// Next.js handles CORS automatically for API routes
```

**D. Check API Route Logs**
```bash
# In terminal running dev server, look for:
# "Chat API error: [error details]"
```

---

## 5. AI Not Responding

### Symptoms
- Loading spinner shows forever
- No AI response after sending message
- Timeout errors

### Solutions

**A. Google AI API Issues**
```bash
# Check API status:
# Visit: https://status.cloud.google.com/

# Verify quota:
# Go to: https://console.cloud.google.com/apis/dashboard
```

**B. Rate Limiting**
```
Error: 429 Too Many Requests

Solution:
- Wait a few minutes
- Check API quota in Google Cloud Console
- Consider upgrading API plan
```

**C. System Prompt Too Long**
```typescript
// In Sanity Studio > AI Configuration
// Shorten system prompt to < 2000 characters
// Shorten additional info to < 1000 characters
```

**D. Network Timeout**
```typescript
// Add timeout to fetch in ai-chat-widget.tsx:
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s

fetch("/api/chat", {
  signal: controller.signal,
  // ... rest of config
});
```

---

## 6. Chat History Not Saving

### Symptoms
- Messages disappear after refresh
- No conversations in Sanity Studio
- Console errors about Sanity

### Solutions

**A. Missing Write Token**
```bash
# Check .env.local:
SANITY_API_WRITE_TOKEN=your_token_here

# Token must have WRITE permissions (Editor or Admin)
```

**B. Verify Token Permissions**
1. Go to https://www.sanity.io/manage
2. Select project
3. API > Tokens
4. Check token has "Editor" or "Admin" role

**C. Sanity Schema Not Deployed**
```bash
# Generate types:
npm run typegen

# Check if chatHistory schema exists:
# Open /studio, should see "Chat History" content type
```

**D. Check Sanity Client**
```typescript
// In sanity/lib/client.ts
// Verify writeClient uses token:
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
```

---

## 7. Slow Responses

### Symptoms
- AI takes > 10 seconds to respond
- Page feels sluggish

### Solutions

**A. Large Context**
```typescript
// Reduce context size in app/api/chat/route.ts
// Limit work experience to 3 items:
const relevantExperience = profile.workExperience
  .filter((exp: any) => !exp.hideFromCV)
  .slice(0, 3);
```

**B. System Prompt Too Detailed**
```
// In Sanity Studio > AI Configuration
// Keep system prompt concise and focused
// Aim for < 1000 characters total
```

**C. Model Selection**
```typescript
// In app/api/chat/route.ts
// Ensure using fast model:
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" // Fast model
  // NOT "gemini-1.5-pro" (slower but better)
});
```

**D. Network Issues**
- Check your internet connection
- Try different network/WiFi

---

## 8. Build Errors

### Symptoms
- `npm run build` fails
- TypeScript errors
- Import errors

### Solutions

**A. TypeScript Errors**
```bash
# Check types:
npx tsc --noEmit

# Regenerate Sanity types:
npm run typegen
```

**B. Missing Dependencies**
```bash
# Reinstall everything:
rm -rf node_modules package-lock.json
npm install
```

**C. Import Path Issues**
```typescript
// Use absolute imports with @:
import { Component } from '@/components/component'
// NOT relative: '../../../components/component'
```

**D. Environment Variables in Build**
```bash
# For production build, ensure variables are set:
GOOGLE_AI_API_KEY=xxx npm run build
```

---

## 9. Styling Issues

### Symptoms
- Wrong colors
- Layout broken
- Overlapping elements

### Solutions

**A. Tailwind Not Applied**
```bash
# Check globals.css is imported in layout.tsx
# Rebuild:
npm run dev
```

**B. Component Styles Conflict**
```typescript
// Check shadcn components are properly imported
// Reinstall if needed:
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
```

**C. Dark Mode Issues**
```typescript
// Check ThemeProvider in layout.tsx:
<ThemeProvider attribute="class" defaultTheme="system">
  {/* ... */}
</ThemeProvider>
```

**D. Mobile Styles**
```css
/* Check responsive classes:
sm:max-w-[500px]  // Tablet
max-w-full         // Mobile
*/
```

---

## 10. Mobile Issues

### Symptoms
- Button too small/large on mobile
- Dialog cuts off
- Keyboard covers input

### Solutions

**A. Viewport Issues**
```html
<!-- Check meta tag in layout.tsx: -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

**B. Dialog Height on Mobile**
```typescript
// Dialog should have:
className="sm:max-w-[500px] h-[600px]"
// Adjust height as needed for mobile
```

**C. Keyboard Overlap**
```typescript
// Add to dialog content:
className="overflow-y-auto"
// Ensures scrolling when keyboard appears
```

**D. Touch Events**
```typescript
// Ensure buttons are large enough:
// Minimum 44x44px for touch targets
className="h-14 w-14" // 56x56px - good for touch
```

---

## Common Error Messages

### "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
```bash
# Add to .env.local:
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

### "Failed to load configuration file"
```bash
# Your Sanity config needs env variables to load
# Set them first, then:
npm run dev
```

### "Cannot find module '@/components/ai-chat-widget'"
```bash
# Check file exists:
ls components/ai-chat-widget.tsx

# If missing, you may have skipped a commit
# Check git history
```

### "GoogleGenerativeAI is not defined"
```bash
# Install package:
npm install @google/generative-ai

# Restart server:
npm run dev
```

---

## Debug Mode

Enable detailed logging:

```typescript
// In app/api/chat/route.ts, add at the top:
const DEBUG = true;

// Then throughout the file:
if (DEBUG) {
  console.log("Full system prompt:", fullSystemPrompt);
  console.log("User message:", message);
  console.log("AI response:", aiResponse);
}
```

## Getting Help

If issues persist:

1. **Check Documentation:**
   - QUICK_START_AI_CHAT.md
   - AI_CHAT_SETUP.md
   - TESTING_GUIDE.md

2. **Check Logs:**
   - Browser Console (F12)
   - Terminal (server logs)
   - Vercel logs (if deployed)

3. **Test with Minimal Config:**
   - Start with basic system prompt
   - Test with one message
   - Add complexity gradually

4. **Verify Services:**
   - Google AI API status
   - Sanity service status
   - Your internet connection

5. **Create Issue:**
   - Include error messages
   - Describe steps to reproduce
   - Share relevant code snippets

---

## Quick Diagnostics Checklist

Run through this checklist to diagnose issues:

```
[ ] Environment variables set in .env.local
[ ] Dev server restarted after env changes
[ ] Browser cache cleared
[ ] Console shows no errors
[ ] /studio accessible
[ ] AI Configuration exists in Sanity
[ ] chatHistory schema visible in Sanity
[ ] Google AI API key is valid
[ ] Sanity write token has permissions
[ ] Dependencies installed (node_modules exists)
[ ] No TypeScript errors (npm run type-check)
[ ] Build succeeds (npm run build)
```

---

**Still Stuck?** 

Review the complete error message in:
- Browser DevTools Console (F12)
- Terminal running the dev server
- Network tab in DevTools (for API calls)

The error message usually points directly to the issue!
