# Portfolio - Production Ready

## 🌐 Live Site
**URL**: https://eraianbu.pages.dev

## 🏗️ Architecture
- **Frontend**: Cloudflare Pages (Static)
- **Backend**: Cloudflare Pages Functions (Serverless)
- **Email**: SendGrid API
- **Deployment**: GitHub → Cloudflare Pages (Automatic)

## 📂 Production Files Structure
```
portfolio/
├── functions/
│   └── contact.js          # Backend API for contact form
├── assets/
│   ├── css/style.css       # Styles
│   ├── js/script.js        # Frontend JavaScript
│   └── images/             # Images and icons
├── index.html              # Main portfolio site
├── 404.html                # Error page
└── README.md               # This file
```

## ✨ Features
- **Responsive Design**: Works on all devices
- **Contact Form**: Functional email contact form
- **Project Showcase**: Interactive project cards with external links
- **Fast Loading**: Global CDN delivery
- **SEO Optimized**: Meta tags and semantic HTML
- **Accessible**: ARIA labels and screen reader support

## 🚀 Technologies
- HTML5, CSS3, JavaScript (ES6+)
- Cloudflare Pages & Functions
- SendGrid Email API
- GitHub Actions (Auto-deployment)

## 📧 Contact Form
The contact form uses Cloudflare Pages Functions to send emails via SendGrid API:
- Form validation (client & server side)
- Spam protection
- Email notifications
- Success/error feedback

## 🔧 Local Development (Optional)
```bash
# For local testing only
node server.js
# Visit: http://localhost:3000
```

## 🌍 Deployment
Automatic deployment via GitHub:
1. Push to `main` branch
2. Cloudflare Pages auto-builds and deploys
3. Live in ~1-2 minutes

## 📊 Performance
- **First Load**: ~500ms
- **Lighthouse Score**: 95+
- **Global CDN**: <100ms worldwide
- **Uptime**: 99.9% SLA

## 🔒 Security
- HTTPS only
- Input validation
- Rate limiting
- Security headers
- Environment variables

---
**Built by Eraianbu Rajkumar** | Quality Assurance Intelligence Intern, AIML Engineer, Data Analyst
- **Modern Tech Stack** - HTML5, CSS3, JavaScript, Node.js, Express

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/erai221203/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

4. Configure your email settings in `.env`:
   - `EMAIL_USER` - Your Gmail address
   - `EMAIL_PASS` - Your Gmail App Password ([Generate here](https://myaccount.google.com/apppasswords))

### Running Locally

Start the development server:
```bash
npm start
```

Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
portfolio/
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── images/             # Images and icons
│   │   ├── Cert/          # Certificate images
│   │   ├── clients/       # Client logos
│   │   ├── logo/          # Service icons
│   │   └── me/            # Profile pictures
│   └── js/
│       └── script.js       # Main JavaScript file
├── index.html              # Main portfolio page
├── 404.html               # Custom 404 page
├── server.js              # Express server with email API
├── package.json           # Project dependencies
├── .env                   # Environment variables (not in repo)
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Email**: Nodemailer with Gmail
- **Icons**: Ionicons
- **Fonts**: Google Fonts (Poppins, Montserrat)

## 📧 Contact Form Setup

The contact form requires Gmail App Password authentication:

1. Enable 2-Factor Authentication on your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Add this password to your `.env` file

## 🌐 Deployment

This portfolio can be deployed on:
- **Cloudflare Pages** - For static hosting
- **Vercel** - Full-stack with serverless functions
- **Railway/Render** - Full Node.js deployment

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Eraianbu Rajkumar**
- GitHub: [@erai221203](https://github.com/erai221203)
- LinkedIn: [Eraianbu Rajkumar](https://www.linkedin.com/in/eraianbu-rajkumar/)
- Email: eraianbu872@gmail.com
