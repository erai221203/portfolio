// Cloudflare Worker for portfolio contact form
// Replaces the Node.js/Express server for production deployment

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input to prevent injection
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 1000); // Limit length
}

// CORS headers for the response
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

// Security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

async function sendEmail(name, email, message, env) {
  // Check if email credentials are configured
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    throw new Error('Email service not configured');
  }

  // Create email content
  const emailBody = `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

Sent from: Portfolio Contact Form
  `.trim();

  // Use Cloudflare's email sending (or external service like SendGrid)
  // For now, we'll use a simple fetch to Gmail SMTP (this is a simplified example)
  // In production, you'd use SendGrid, Resend, or Cloudflare's Email Workers
  
  const response = await fetch('https://api.sendgrid.v3.mail.send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: env.EMAIL_USER }],
        subject: `Portfolio Contact: ${name}`
      }],
      from: { email: env.EMAIL_USER },
      reply_to: { email: email },
      content: [{
        type: 'text/plain',
        value: emailBody
      }]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    // Only handle POST requests to /contact
    if (request.method !== 'POST' || url.pathname !== '/contact') {
      return new Response('Not Found', { 
        status: 404,
        headers: { ...corsHeaders, ...securityHeaders }
      });
    }

    try {
      // Parse JSON body
      const body = await request.json();
      const { fullname, email, message } = body;

      // Basic validation
      if (!fullname || !email || !message) {
        return new Response(
          JSON.stringify({ message: 'All fields are required.' }), 
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
              ...securityHeaders
            }
          }
        );
      }

      // Validate email format
      if (!isValidEmail(email)) {
        return new Response(
          JSON.stringify({ message: 'Invalid email format.' }), 
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
              ...securityHeaders
            }
          }
        );
      }

      // Sanitize inputs
      const sanitizedName = sanitizeInput(fullname);
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedMessage = sanitizeInput(message);

      // Send email
      await sendEmail(sanitizedName, sanitizedEmail, sanitizedMessage, env);

      return new Response(
        JSON.stringify({ message: 'Email sent successfully!' }), 
        {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...securityHeaders
          }
        }
      );

    } catch (error) {
      console.error('Email sending failed:', error.message);
      
      return new Response(
        JSON.stringify({ message: 'Failed to send email. Please try again later.' }), 
        {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...securityHeaders
          }
        }
      );
    }
  },
};