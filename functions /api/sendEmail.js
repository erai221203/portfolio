export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { fullname, email, message } = body;

    // Validate inputs
    if (!fullname || !email || !message) {
      return new Response(JSON.stringify({ message: "All fields are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get environment variables from .env (Cloudflare Dashboard)
    const SENDGRID_API_KEY = context.env.SENDGRID_API_KEY;
    const TO_EMAIL = context.env.EMAIL_USER;

    const emailData = {
      personalizations: [
        {
          to: [{ email: TO_EMAIL }],
          subject: `New message from ${fullname}`
        }
      ],
      from: { email: email },
      content: [
        {
          type: "text/plain",
          value: `Name: ${fullname}\nEmail: ${email}\nMessage: ${message}`
        }
      ]
    };

    const sgResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailData)
    });

    if (sgResponse.ok) {
      return new Response(JSON.stringify({ message: "Email sent successfully!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      const errorText = await sgResponse.text();
      return new Response(JSON.stringify({ message: "Failed to send email.", error: errorText }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ message: "Server error.", error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
