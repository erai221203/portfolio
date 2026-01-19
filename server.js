// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5500', // Live Server
    'https://eraianbu.pages.dev', // Your Cloudflare Pages domain
    /\.pages\.dev$/ // Allow any Cloudflare Pages preview URLs
  ]
}));
app.use(bodyParser.json({ limit: '10kb' })); // Limit body size for security

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Log environment status (don't log actual values in production)
const isProduction = process.env.NODE_ENV === 'production';
console.log("✅ EMAIL_USER:", process.env.EMAIL_USER ? "Configured" : "Not Configured");
console.log("✅ EMAIL_PASS:", process.env.EMAIL_PASS ? "Configured" : "Not Configured");

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

  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Email credentials not configured");
    return res.status(500).json({ message: "Email service not configured." });
  }

  // Create the email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Use authenticated email as sender
    replyTo: sanitizedEmail, // Allow replying to the contact
    to: process.env.EMAIL_USER,
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
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    res.status(500).json({ message: "Failed to send email. Please try again later." });
  }
};

// Register all email endpoints for maximum compatibility
app.post("/send-email", sendEmailHandler);
app.post("/api/sendEmail", sendEmailHandler);
app.post("/contact", sendEmailHandler); // Added for universal access

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
