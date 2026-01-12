# Testing Guide - AI Chat Feature

This guide provides a comprehensive testing checklist for the AI chat feature.

## Pre-Testing Setup

Before running tests, ensure:
- [ ] All environment variables are set correctly
- [ ] Development server is running (`npm run dev`)
- [ ] Sanity Studio is accessible at `/studio`
- [ ] AI Configuration is created and published in Sanity

## Testing Checklist

### 1. Environment Setup ✓

**Verify Environment Variables:**
```bash
# Check if variables are loaded
echo $GOOGLE_AI_API_KEY
echo $SANITY_API_WRITE_TOKEN
```

**Expected Result:**
- Both variables should have values
- Not "undefined" or empty

**If Failed:**
- Check `.env.local` exists and contains the variables
- Restart dev server after adding variables

---

### 2. Visual Appearance ✓

**Test: Floating Button Appears**

Steps:
1. Open http://localhost:3000
2. Look at the bottom-right corner

**Expected Result:**
- ✓ Blue-cyan gradient circular button visible
- ✓ Message icon (💬) displayed
- ✓ Button has shadow
- ✓ Button is clickable

**Test: Button Hover Effect**

Steps:
1. Hover over the floating button

**Expected Result:**
- ✓ Shadow increases
- ✓ Smooth transition animation

---

### 3. Contact Form ✓

**Test: Dialog Opens**

Steps:
1. Click the floating chat button

**Expected Result:**
- ✓ Modal dialog opens
- ✓ "AI Assistant" title visible
- ✓ Contact form is displayed
- ✓ Close button (X) visible

**Test: Form Validation - Empty Submit**

Steps:
1. Leave all fields empty
2. Click "Start Chat"

**Expected Result:**
- ✓ Alert appears: "Please provide at least your email, phone, or name..."
- ✓ Form doesn't submit

**Test: Form Validation - Single Field**

Steps:
1. Enter only name: "Test User"
2. Click "Start Chat"

**Expected Result:**
- ✓ Form submits successfully
- ✓ Contact form disappears
- ✓ Chat interface appears

**Test: Form Validation - Email**

Steps:
1. Refresh, click chat button
2. Enter only email: "test@example.com"
3. Click "Start Chat"

**Expected Result:**
- ✓ Form accepts and proceeds to chat

**Test: All Fields Filled**

Steps:
1. Fill in all fields:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "+1234567890"
   - Company: "Test Corp"
2. Click "Start Chat"

**Expected Result:**
- ✓ All data captured
- ✓ Proceeds to chat interface

---

### 4. Chat Interface ✓

**Test: Greeting Message**

Steps:
1. After submitting contact form

**Expected Result:**
- ✓ AI greeting message appears
- ✓ Message is left-aligned
- ✓ Timestamp is shown
- ✓ Gray background on message

**Test: Send Message - Basic**

Steps:
1. Type "Hello" in the text area
2. Click the send button (➤)

**Expected Result:**
- ✓ Message appears on right side
- ✓ Cyan background on user message
- ✓ Loading indicator appears
- ✓ AI response arrives (may take 2-5 seconds)
- ✓ AI response appears on left side
- ✓ Auto-scroll to bottom

**Test: Send Message - Enter Key**

Steps:
1. Type "What are your skills?"
2. Press Enter

**Expected Result:**
- ✓ Message sends (same as clicking button)

**Test: Send Message - Shift+Enter**

Steps:
1. Type "Tell me"
2. Press Shift+Enter
3. Type "more"
4. Press Enter

**Expected Result:**
- ✓ First line: "Tell me"
- ✓ Second line: "more"
- ✓ Message sent as multi-line

**Test: Loading State**

Steps:
1. Send a message
2. Observe immediately after sending

**Expected Result:**
- ✓ Input disabled
- ✓ Send button disabled
- ✓ Spinner icon appears
- ✓ Loading message visible

**Test: Multiple Messages**

Steps:
1. Send: "What are your skills?"
2. Wait for response
3. Send: "Tell me about your experience"
4. Wait for response
5. Send: "Are you available?"

**Expected Result:**
- ✓ All messages display in order
- ✓ Conversation history maintained
- ✓ Each message has timestamp
- ✓ Auto-scroll works for all messages

---

### 5. AI Response Quality ✓

**Test: Context Awareness**

Steps:
1. Ask: "What is your name?"

**Expected Result:**
- ✓ AI responds with name from CV profile
- ✓ Answer is accurate

**Test: Skills Question**

Steps:
1. Ask: "What technologies do you know?"

**Expected Result:**
- ✓ AI mentions skills from CV profile
- ✓ Includes frontend/backend/DevOps skills
- ✓ Response is coherent and professional

**Test: Availability Question**

Steps:
1. Ask: "Are you available for work?"

**Expected Result:**
- ✓ AI mentions work availability from additional info
- ✓ Professional and encouraging response

**Test: Project Question**

Steps:
1. Ask: "Tell me about your projects"

**Expected Result:**
- ✓ AI mentions projects from CV profile
- ✓ Highlights key/pinned projects if available

**Test: Selling Tone**

Steps:
1. Ask: "Why should I hire you?"

**Expected Result:**
- ✓ AI emphasizes strengths
- ✓ Professional and persuasive tone
- ✓ Highlights value proposition

---

### 6. Data Persistence ✓

**Test: Chat History Saved**

Steps:
1. Complete a chat conversation (3-5 messages)
2. Go to http://localhost:3000/studio
3. Navigate to "Chat History"
4. Find your recent conversation

**Expected Result:**
- ✓ Conversation appears in list
- ✓ User contact info saved correctly
- ✓ All messages present
- ✓ Timestamps accurate
- ✓ Message roles correct (user/assistant)

**Test: Session Persistence**

Steps:
1. Send some messages
2. Close the dialog
3. Reopen the dialog

**Expected Result:**
- ✓ Previous messages still visible
- ✓ Can continue conversation
- ✓ Context maintained

---

### 7. Error Handling ✓

**Test: Invalid API Key**

Steps:
1. Set `GOOGLE_AI_API_KEY` to "invalid_key"
2. Restart server
3. Try to send a message

**Expected Result:**
- ✓ Error message appears in chat
- ✓ No crash
- ✓ User can try again
- ✓ Error logged in console

**Test: Network Error Simulation**

Steps:
1. Open browser DevTools
2. Go to Network tab
3. Set throttling to "Offline"
4. Try to send a message

**Expected Result:**
- ✓ Error message appears
- ✓ Graceful degradation
- ✓ Can retry when online

**Test: Long Message**

Steps:
1. Send a very long message (500+ words)

**Expected Result:**
- ✓ Message sends successfully
- ✓ AI responds (may take longer)
- ✓ No truncation or errors

---

### 8. Responsive Design ✓

**Test: Mobile View (iPhone)**

Steps:
1. Open Chrome DevTools
2. Toggle device toolbar
3. Select "iPhone 12 Pro"
4. Test all features

**Expected Result:**
- ✓ Chat button visible and appropriately sized
- ✓ Dialog fills screen properly
- ✓ Text readable
- ✓ Input area accessible
- ✓ All functions work

**Test: Tablet View (iPad)**

Steps:
1. Select "iPad" in device toolbar
2. Test in both portrait and landscape

**Expected Result:**
- ✓ Layout adapts correctly
- ✓ Dialog properly sized
- ✓ All features functional

**Test: Desktop View**

Steps:
1. Test at various widths: 1920px, 1366px, 1024px

**Expected Result:**
- ✓ Consistent appearance
- ✓ Proper spacing
- ✓ Button always visible

---

### 9. Accessibility ✓

**Test: Keyboard Navigation**

Steps:
1. Use Tab key to navigate
2. Try to interact without mouse

**Expected Result:**
- ✓ Can focus on chat button
- ✓ Can open dialog with Enter/Space
- ✓ Can navigate form fields
- ✓ Can submit form with keyboard
- ✓ Can type and send messages
- ✓ Focus visible on all elements

**Test: Screen Reader (Optional)**

Steps:
1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Navigate the chat interface

**Expected Result:**
- ✓ Button announced properly
- ✓ Form fields labeled correctly
- ✓ Messages readable
- ✓ Loading states announced

---

### 10. Performance ✓

**Test: Initial Load**

Steps:
1. Refresh page
2. Measure time to see chat button

**Expected Result:**
- ✓ Button appears within 1-2 seconds
- ✓ No layout shift

**Test: Message Response Time**

Steps:
1. Send a message
2. Measure time to receive response

**Expected Result:**
- ✓ Response within 3-5 seconds (typical)
- ✓ Loading indicator shows immediately

**Test: Memory Usage**

Steps:
1. Send 20+ messages
2. Check browser memory usage

**Expected Result:**
- ✓ No memory leaks
- ✓ Smooth scrolling maintained

---

### 11. Edge Cases ✓

**Test: Empty Message**

Steps:
1. Try to send empty message

**Expected Result:**
- ✓ Send button disabled
- ✓ Cannot send

**Test: Special Characters**

Steps:
1. Send message with emojis: "Hello 👋 🎉"
2. Send message with code: `` `const x = 5;` ``

**Expected Result:**
- ✓ Characters display correctly
- ✓ AI handles gracefully

**Test: Rapid Messages**

Steps:
1. Send multiple messages quickly

**Expected Result:**
- ✓ All messages queued properly
- ✓ Responses arrive in order
- ✓ No race conditions

**Test: Dialog Close During Load**

Steps:
1. Send a message
2. Immediately close dialog before response

**Expected Result:**
- ✓ Dialog closes
- ✓ No errors
- ✓ Message still saved when reopened

---

## Automated Testing Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## Bug Reporting Template

If you find a bug, report it with:

```markdown
**Bug Description:**
[What happened]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Environment:**
- Browser: 
- OS: 
- Screen size: 

**Console Errors:**
[Paste any errors from browser console]

**Screenshots:**
[If applicable]
```

## Test Results Summary

After completing all tests, fill out:

```
✓ = Pass, ✗ = Fail, ~ = Partial

[ ] 1. Environment Setup
[ ] 2. Visual Appearance
[ ] 3. Contact Form
[ ] 4. Chat Interface
[ ] 5. AI Response Quality
[ ] 6. Data Persistence
[ ] 7. Error Handling
[ ] 8. Responsive Design
[ ] 9. Accessibility
[ ] 10. Performance
[ ] 11. Edge Cases

Notes:
_______________________
```

## Next Steps After Testing

1. ✅ Fix any bugs found
2. ✅ Document any issues in GitHub
3. ✅ Refine AI prompts if needed
4. ✅ Optimize performance if slow
5. ✅ Prepare for production deployment

---

**Testing Complete!** If all tests pass, you're ready for production! 🚀
