# Eraianbu Rajkumar - Portfolio Website

A personal portfolio website showcasing my skills, projects, and experience as a Quality Assurance Intelligence Intern, AIML Engineer, and Data Analyst.

## 🌟 Features

- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Interactive UI** - Smooth animations and transitions
- **Multiple Sections** - Intro, Skills, Projects, Certifications, Resume, and Contact
- **Contact Form** - Email functionality using Nodemailer
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
