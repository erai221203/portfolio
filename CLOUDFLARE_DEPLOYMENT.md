# Cloudflare Pages + Functions Deployment Guide

## Overview
- **Frontend**: Cloudflare Pages (`eraianbu.pages.dev`)
- **Backend**: Cloudflare Pages Functions (`/contact` endpoint)
- **Deployment**: GitHub → Cloudflare Pages (automatic)

## Files Structure
```
portfolio/
├── functions/contact.js     ← Backend API (auto-deployed)
├── index.html              ← Frontend (auto-deployed)
├── assets/                 ← Static files (auto-deployed)
└── worker.js               ← Not needed (can remove)
└── wrangler.toml          ← Not needed (can remove)
```

## Deployment Steps

### 1. Set Up SendGrid (Email Service)
1. You already have SendGrid API key
2. Your API key should start with `SG.`
3. Keep this key handy for step 3

### 2. Push to GitHub
```bash
git add .
git commit -m "Add Cloudflare Pages Functions for contact form"
git push origin main
```

### 3. Set Environment Variables in Cloudflare
1. Go to **Cloudflare Dashboard** → **Pages**
2. Select your **eraianbu** project
3. Go to **Settings** → **Environment variables**
4. Add **Production** variables:
   ```
   SENDGRID_API_KEY = SG.your_sendgrid_api_key_here
   EMAIL_USER = eraianbu872@gmail.com
   ```
5. Click **Save**

### 4. Redeploy (Trigger Build)
1. In Cloudflare Pages dashboard
2. Go to **Deployments**
3. Click **Retry deployment** (or push a new commit)

### 5. Test
Visit `https://eraianbu.pages.dev/contact` and submit the form.

## How It Works
- **GitHub Push** → **Cloudflare Pages** automatically builds and deploys
- `functions/contact.js` becomes `https://eraianbu.pages.dev/contact` endpoint
- Frontend form posts to `/contact` (same origin)
- No separate Worker deployment needed!

## Benefits
✅ **Single Deployment**: Everything deploys together  
✅ **Automatic**: Push to GitHub = instant deploy  
✅ **Same Origin**: No CORS issues  
✅ **Integrated**: Functions are part of Pages  

## Cost
- **Pages**: Free (100,000 requests/month)  
- **Functions**: Free (100,000 requests/month)  
- **SendGrid**: Free (100 emails/day)  

## Alternative Email Services
You can modify `functions/contact.js` to use:
- SendGrid
- Mailgun  
- Postmark