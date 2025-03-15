const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

// CSRF protection
const csrfProtection = csrf({ cookie: true });

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post("/", limiter, csrfProtection, async (req, res) => {
  try {
    // Honeypot check
    if (req.body.website) {
      return res.status(200).json({ message: "Form submitted successfully" });
    }

    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "srichitluri@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
