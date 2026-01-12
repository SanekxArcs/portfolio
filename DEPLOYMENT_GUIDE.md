# Deployment Guide for AI Chat Feature

This guide walks you through deploying the AI chat feature to production.

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Google AI API key obtained from https://makersuite.google.com/app/apikey
- [ ] Sanity API write token with Editor permissions
- [ ] Tested the feature locally (see QUICK_START_AI_CHAT.md)
- [ ] Created AI Configuration in Sanity Studio
- [ ] Reviewed and customized AI prompts
- [ ] Tested on multiple devices and browsers

## Deployment Steps

### 1. Set Up Environment Variables

#### For Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variables for **Production**, **Preview**, and **Development**:

```
GOOGLE_AI_API_KEY=your_actual_google_ai_api_key
SANITY_API_WRITE_TOKEN=your_actual_sanity_write_token
```

4. Click **Save**

#### For Other Platforms:

Add these environment variables to your hosting platform's configuration:
- `GOOGLE_AI_API_KEY`
- `SANITY_API_WRITE_TOKEN`

Make sure they're marked as **secret** or **protected**.

### 2. Deploy the Code

#### Using Vercel (Recommended):

```bash
# Push to GitHub (already connected to Vercel)
git push origin main

# Or deploy directly
npx vercel --prod
```

#### Using Other Platforms:

```bash
# Build the project
npm run build

# Start production server
npm run start
```

### 3. Configure Sanity Studio in Production

1. Navigate to `https://yourdomain.com/studio`
2. Sign in with your Sanity credentials
3. Go to **AI Configuration**
4. Create or update your AI configuration:

**Example System Prompt for Production:**
```
You are an AI assistant representing [Your Name], a talented [Your Role/Title]. 
Your goal is to answer questions about their professional background, skills, 
and services in a professional, enthusiastic, and persuasive manner.

Key Points:
- Always be professional and courteous
- Highlight their technical expertise and achievements
- Emphasize their availability and value proposition
- Provide specific examples when discussing projects or skills
- Encourage potential clients to reach out directly

Important:
- Never make false claims or exaggerate
- Stay on topic about professional matters
- If asked about personal information not in the context, politely redirect to professional topics
```

**Example Additional Information:**
```
[Your Name] is currently available for:
- Full-time employment opportunities
- Freelance projects (min. 3-month engagements)
- Consulting services

Expertise:
- Full-stack web development
- React, Next.js, TypeScript
- Node.js, Python
- Cloud platforms (AWS, Vercel)
- 5+ years of professional experience

Notable achievements:
- Built and scaled applications serving 100K+ users
- Led development teams of 3-5 developers
- Specialized in performance optimization and user experience

Rate: Available upon request
Location: [Your Location] (Remote work available)
```

5. Publish your changes

### 4. Test Production Deployment

After deployment, test thoroughly:

1. Visit your production website
2. Click the chat button in the bottom-right corner
3. Fill in contact information
4. Send test messages:
   - "What are your main skills?"
   - "Tell me about your experience"
   - "Are you available for new projects?"
5. Verify AI responses are appropriate
6. Check Sanity Studio for saved chat history

### 5. Monitor Initial Usage

In the first few days:

1. **Check Chat History**:
   - Go to `/studio` > **Chat History**
   - Review conversations
   - Note common questions

2. **Monitor Errors**:
   - Check server logs for errors
   - Monitor Vercel/hosting platform logs
   - Watch for API rate limit issues

3. **Refine AI Prompts**:
   - Based on actual conversations
   - Improve responses to common questions
   - Add more context if needed

## Post-Deployment Configuration

### API Rate Limits

Consider implementing rate limiting to prevent abuse:

```typescript
// Example: Add to app/api/chat/route.ts
import { ratelimit } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  // Rate limiting
  const identifier = request.ip ?? 'anonymous'
  const { success } = await ratelimit.limit(identifier)
  
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    )
  }
  
  // ... rest of the code
}
```

### Analytics Setup

Track chat usage:

1. Add event tracking to chat widget
2. Monitor:
   - Number of chats initiated
   - Average messages per conversation
   - Most common questions
   - Conversion rate (chat → contact)

### Email Notifications (Optional)

Set up notifications for new chats:

1. Create webhook in Sanity Studio
2. Trigger email on new chat creation
3. Include user contact info and initial message

## Monitoring and Maintenance

### Regular Tasks

**Daily**:
- Check for new chat conversations
- Respond to any flagged issues

**Weekly**:
- Review AI response quality
- Update prompts if needed
- Check API usage and costs

**Monthly**:
- Analyze chat patterns
- Update CV profile data
- Review and optimize prompts

### Costs

Keep track of:
- **Google AI API**: Free tier includes 60 requests per minute
- **Sanity**: Free tier includes 100k API requests/month
- **Hosting**: Vercel free tier or your hosting costs

### Troubleshooting Production Issues

**Chat button not appearing:**
```bash
# Check build logs
vercel logs [deployment-url]

# Verify environment variables
vercel env ls
```

**API errors:**
```bash
# Check API logs
vercel logs [deployment-url] --follow

# Test API endpoint
curl -X POST https://yourdomain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","sessionId":"test123"}'
```

**Chat history not saving:**
- Verify Sanity write token is set
- Check token has correct permissions
- Review Sanity API logs

## Security Best Practices

1. **Rotate API Keys Regularly**: Change keys every 3-6 months
2. **Monitor Usage**: Watch for unusual patterns
3. **Review Chat History**: Check for abuse or spam
4. **Limit Context**: Don't include sensitive personal info in CV profile
5. **GDPR Compliance**: Add privacy policy if collecting EU user data

## Rollback Procedure

If you need to disable the chat feature:

1. Remove from layout:
   ```typescript
   // In app/(website)/layout.tsx
   // Comment out or remove:
   // <AiChatWidget />
   ```

2. Redeploy:
   ```bash
   git commit -am "Temporarily disable AI chat"
   git push
   ```

3. Chat button disappears, but data remains safe in Sanity

## Success Metrics

Track these KPIs:
- Number of chat conversations per day/week
- Average conversation length
- Response quality (manual review)
- Conversion rate (chat → actual contact)
- User satisfaction (feedback if collected)

## Support Resources

- [Google AI Documentation](https://ai.google.dev/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

## Next Steps

After successful deployment:

1. ✅ Monitor chat conversations for first week
2. ✅ Collect feedback from users
3. ✅ Optimize AI prompts based on real conversations
4. ✅ Consider adding more features (see IMPLEMENTATION_SUMMARY.md)
5. ✅ Share the feature with your network

## Need Help?

If you encounter issues:
1. Check [QUICK_START_AI_CHAT.md](./QUICK_START_AI_CHAT.md) for troubleshooting
2. Review server and browser console logs
3. Verify all environment variables are set correctly
4. Test with a fresh browser/incognito mode
5. Check Sanity Studio for configuration issues

---

**Congratulations!** Your AI chat feature is now live and ready to help sell your services! 🎉
