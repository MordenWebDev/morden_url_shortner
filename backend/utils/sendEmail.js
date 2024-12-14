// utils/sendEmail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Or another service you're using
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.GMAIL_PASS, // Your email password or app password
  },
});

// Send email function
export const sendEmail = async (to, subject, body) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: body, // Sending HTML body
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
