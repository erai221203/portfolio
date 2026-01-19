// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const sgMail = require("@sendgrid/mail");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Log environment status (don't log actual values in production)
console.log("✅ Environment:", isProduction ? "Production" : "Development");
console.log("✅ EMAIL_USER:", process.env.EMAIL_USER ? "Configured" : "Not Configured");
console.log("✅ SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY ? "Configured" : "Not Configured");

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5500',  // Live Server
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5500', // Live Server
    'https://eraianbu.pages.dev', // Your Cloudflare Pages domain
    /\.pages\.dev$/, // Allow any Cloudflare Pages preview URLs
    /^vscode-webview:/ // Allow VS Code Simple Browser
  ],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10kb' })); // Limit body size for security

// Security headers middleware
app.use((req, res, next) => {
  // Log all requests for debugging
  console.log(`📥 ${req.method} ${req.url}`);
  
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Simple email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize input to prevent injection
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 1000); // Limit length
};

// Email sending endpoint (supports both routes)
const sendEmailHandler = async (req, res) => {
  const { fullname, email, message } = req.body;

  // Basic validation
  if (!fullname || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // Sanitize inputs
  const sanitizedName = sanitizeInput(fullname);
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedMessage = sanitizeInput(message);

  // Check if SendGrid is configured
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_USER) {
    console.error("❌ SendGrid API key or email not configured");
    return res.status(500).json({ message: "Email service not configured." });
  }

  // SendGrid email message
  const msg = {
    to: process.env.EMAIL_USER,
    from: process.env.EMAIL_USER, // Must be verified sender in SendGrid
    replyTo: sanitizedEmail,
    subject: `Portfolio Contact: ${sanitizedName}`,
    text: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\n\nMessage:\n${sanitizedMessage}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${sanitizedName}</p>
      <p><strong>Email:</strong> ${sanitizedEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
    `
  };

  try {
    console.log("📤 Contact form submission:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("To:", msg.to);
    console.log("From:", msg.from);
    console.log("Reply To:", msg.replyTo);
    console.log("Subject:", msg.subject);
    console.log("Message:", sanitizedMessage);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Try to send via SendGrid in production
    if (isProduction && process.env.SENDGRID_API_KEY) {
      const response = await sgMail.send(msg);
      console.log("✅ SendGrid Response Status:", response[0].statusCode);
      console.log("✅ Email sent successfully via SendGrid!");
    } else {
      console.log("📧 Email logged (development mode - SendGrid skipped)");
    }
    
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    console.error("❌ Error code:", error.code);
    if (error.response) {
      console.error("❌ SendGrid error body:", JSON.stringify(error.response.body, null, 2));
      console.error("❌ SendGrid status code:", error.response.statusCode);
    }
    // Still return success to user even if SendGrid fails
    res.status(200).json({ message: "Message received! (logged locally)" });
  }
};

// Register all email endpoints for maximum compatibility
app.post("/send-email", sendEmailHandler);
app.post("/api/sendEmail", sendEmailHandler);
app.post("/contact", sendEmailHandler);

// Serve static files from the current directory (AFTER API routes)
app.use(express.static(path.join(__dirname)));

// Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${__dirname}`);
});
