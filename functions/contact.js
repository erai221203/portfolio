// Cloudflare Pages Function for contact form
// This file is automatically deployed when you push to GitHub

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Security headers
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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
    const sanitizedName = fullname.trim().slice(0, 1000);
    const sanitizedEmail = email.trim().slice(0, 1000);
    const sanitizedMessage = message.trim().slice(0, 1000);

    // Send email using SendGrid
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: env.EMAIL_USER }],
          subject: `Portfolio Contact: ${sanitizedName}`
        }],
        from: { email: env.EMAIL_USER, name: 'Portfolio Contact Form' },
        reply_to: { email: sanitizedEmail, name: sanitizedName },
        content: [
          {
            type: 'text/plain',
            value: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\n\nMessage:\n${sanitizedMessage}`
          },
          {
            type: 'text/html',
            value: `
              <h3>New Contact Form Submission</h3>
              <p><strong>Name:</strong> ${sanitizedName}</p>
              <p><strong>Email:</strong> ${sanitizedEmail}</p>
              <p><strong>Message:</strong></p>
              <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
            `
          }
        ]
      })
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

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
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  });
}