# AI Chat Feature - UI Flow

## Visual Overview

This document describes the user interface and user flow for the AI chat feature.

## 1. Initial State - Floating Button

When a user visits the website, they see:

```
┌─────────────────────────────────────────┐
│                                         │
│         Your Portfolio Website          │
│                                         │
│                                    ┌────┐
│                                    │ 💬 │  <- Floating Chat Button
│                                    └────┘
│                                         │
└─────────────────────────────────────────┘
```

**Button Properties:**
- Location: Bottom-right corner (6rem from bottom, 6rem from right)
- Size: 56x56 pixels (h-14 w-14)
- Style: Rounded circle with gradient (cyan to blue)
- Icon: MessageCircle from lucide-react
- Animation: Shadow hover effect

## 2. Contact Information Dialog

When clicked, a modal opens requesting contact information:

```
┌───────────────────────────────────────────────┐
│  💬 AI Assistant                          ✕   │
├───────────────────────────────────────────────┤
│                                               │
│  Before we start, please share at least one   │
│  way for me to contact you:                   │
│                                               │
│  Name or Company Name                         │
│  ┌─────────────────────────────────────────┐ │
│  │ Your name or company name               │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Email                                        │
│  ┌─────────────────────────────────────────┐ │
│  │ your@email.com                          │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Phone Number                                 │
│  ┌─────────────────────────────────────────┐ │
│  │ +1234567890                             │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Company Name (Optional)                      │
│  ┌─────────────────────────────────────────┐ │
│  │ Your company                            │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │          Start Chat                     │ │
│  └─────────────────────────────────────────┘ │
│                                               │
└───────────────────────────────────────────────┘
```

**Validation:**
- At least ONE field must be filled (name, email, or phone)
- Form won't submit without at least one contact method

## 3. Chat Interface

After submitting contact info, the chat interface appears:

```
┌───────────────────────────────────────────────┐
│  💬 AI Assistant                          ✕   │
├───────────────────────────────────────────────┤
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │ Hi! 👋 I'm an AI assistant here to     │ │
│  │ answer any questions you have.          │ │
│  │                            9:30 AM      │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│                ┌──────────────────────────┐   │
│                │ What are your skills?   │   │
│                │                 9:31 AM │   │
│                └──────────────────────────┘   │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │ I specialize in full-stack web         │ │
│  │ development with expertise in React,    │ │
│  │ Next.js, TypeScript, and Node.js...    │ │
│  │                            9:31 AM      │ │
│  └─────────────────────────────────────────┘ │
│                                               │
├───────────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  ┌──┐  │
│  │ Type your message...             │  │➤ │  │
│  │                                  │  │  │  │
│  │                                  │  │  │  │
│  └──────────────────────────────────┘  └──┘  │
└───────────────────────────────────────────────┘
```

**Message Styles:**
- **AI Messages** (left-aligned):
  - Background: Muted gray
  - Max width: 80%
  - Rounded corners
  - Timestamp below

- **User Messages** (right-aligned):
  - Background: Cyan-500 (brand color)
  - Text: White
  - Max width: 80%
  - Rounded corners
  - Timestamp below

**Input Area:**
- Multi-line textarea (3 rows minimum)
- Send button (paper plane icon)
- Disabled while loading
- Enter to send, Shift+Enter for new line

## 4. Loading State

While waiting for AI response:

```
┌───────────────────────────────────────────────┐
│  ...previous messages...                      │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │  ⟳  Loading...                          │ │
│  └─────────────────────────────────────────┘ │
│                                               │
└───────────────────────────────────────────────┘
```

**Loading Indicator:**
- Spinning loader icon (Loader2 from lucide-react)
- Appears in AI message position
- Send button disabled during loading

## 5. Error State

If an error occurs:

```
┌───────────────────────────────────────────────┐
│  ...previous messages...                      │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │ Sorry, I encountered an error:          │ │
│  │ [Error message]. Please try again.      │ │
│  │                            9:32 AM      │ │
│  └─────────────────────────────────────────┘ │
│                                               │
└───────────────────────────────────────────────┘
```

## 6. Mobile View

On mobile devices (< 640px):

```
┌─────────────────┐
│                 │
│   Your Site     │
│                 │
│            ┌──┐ │ <- Smaller button
│            │💬│ │
│            └──┘ │
└─────────────────┘

Dialog fills screen:
┌─────────────────┐
│ 💬 AI Asst  ✕  │
├─────────────────┤
│                 │
│  Messages...    │
│                 │
│                 │
├─────────────────┤
│ ┌───────┐  ┌─┐ │
│ │ Type  │  │➤│ │
│ └───────┘  └─┘ │
└─────────────────┘
```

## Color Scheme

**Light Mode:**
- Button: Cyan-500 to Blue-500 gradient
- User messages: Cyan-500
- AI messages: Muted background
- Text: Default foreground

**Dark Mode:**
- Button: Same gradient (stands out more)
- User messages: Cyan-500 (slightly brighter)
- AI messages: Darker muted background
- Text: Light foreground

## Accessibility

- ✅ Keyboard navigation supported
- ✅ Focus states on all interactive elements
- ✅ ARIA labels on buttons
- ✅ Proper heading structure
- ✅ Sufficient color contrast
- ✅ Screen reader friendly

## Animations

- **Button Hover**: Scale and shadow increase
- **Dialog Open**: Fade in with scale
- **Message Appear**: Fade in from bottom
- **Loading**: Spinning animation
- **Scroll**: Smooth auto-scroll to latest message

## Responsive Breakpoints

- **Mobile**: < 640px
  - Dialog: Full screen height
  - Button: Slightly smaller

- **Tablet**: 640px - 1024px
  - Dialog: Max width 500px
  - Centered on screen

- **Desktop**: > 1024px
  - Dialog: Max width 500px
  - Better spacing and padding

## User Experience Highlights

1. **Non-intrusive**: Floating button doesn't block content
2. **Clear CTA**: Bright, animated button catches attention
3. **Simple onboarding**: Quick contact form, not overwhelming
4. **Real-time feedback**: Loading states, timestamps
5. **Error recovery**: Clear error messages, ability to retry
6. **Mobile-optimized**: Works seamlessly on all devices
7. **Accessible**: Keyboard and screen reader support

## Technical Notes

- Built with shadcn/ui components (Dialog, Input, Button, etc.)
- Uses Tailwind CSS for styling
- Responsive and mobile-first design
- Smooth animations with CSS transitions
- Auto-scroll to latest messages
- Client-side state management with React hooks

---

This UI flow ensures a smooth, professional experience that encourages engagement while collecting valuable contact information.
