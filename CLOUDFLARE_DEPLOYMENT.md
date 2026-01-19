# Cloudflare Full-Stack Deployment Guide

## Overview
- **Frontend**: Cloudflare Pages (`eraianbu.pages.dev`)
- **Backend**: Cloudflare Workers (`/contact` endpoint)
- **Unified**: Everything runs on Cloudflare infrastructure

## Files Created
- `worker.js` - Cloudflare Worker that handles contact form submissions
- `wrangler.toml` - Cloudflare Worker configuration
- Updated `index.html` - Uses same-origin `/contact` requests

## Deployment Steps

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### 2. Set Up Email Service (Choose One)

#### Option A: SendGrid (Recommended)
```bash
# Sign up at sendgrid.com for free tier
# Get API key from dashboard
wrangler secret put SENDGRID_API_KEY
wrangler secret put EMAIL_USER
```

#### Option B: Resend (Alternative)
```bash
# Sign up at resend.com
# Get API key
wrangler secret put RESEND_API_KEY
wrangler secret put EMAIL_USER
```

### 3. Deploy Worker
```bash
# From your project directory
wrangler deploy
```

### 4. Configure Pages + Workers Integration
In Cloudflare Dashboard:
1. Go to your Pages project (`eraianbu`)
2. Settings → Functions
3. Add route: `/contact` → `eraianbu-portfolio-api`

### 5. Test
Visit `eraianbu.pages.dev/contact` and submit the form.

## Environment Variables Needed
- `SENDGRID_API_KEY` - Your SendGrid API key
- `EMAIL_USER` - Your email address (where messages are sent)

## Cost
- **Pages**: Free (100,000 requests/month)
- **Workers**: Free (100,000 requests/month)
- **SendGrid**: Free (100 emails/day)

## Benefits
✅ Single provider (Cloudflare)  
✅ Global CDN  
✅ Automatic scaling  
✅ No server maintenance  
✅ Same-origin requests (no CORS issues)  

## Alternative Email Services
If you prefer, you can modify `worker.js` to use:
- Resend
- Mailgun
- Postmark
- Or any HTTP-based email service