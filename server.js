// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Debugging env variables
console.log("✅ EMAIL_USER:", process.env.EMAIL_USER);
console.log("✅ EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

// Root route for testing
app.get("/", (req, res) => {
  res.send("👋 Backend is running!");
});

// Email sending endpoint
app.post("/send-email", async (req, res) => {
  const { fullname, email, message } = req.body;

  // Basic validation
  if (!fullname || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Create the email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail
      pass: process.env.EMAIL_PASS, // App password (not your login password!)
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New message from ${fullname}`,
    text: `Name: ${fullname}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    res.status(500).json({ message: "Failed to send email.", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
