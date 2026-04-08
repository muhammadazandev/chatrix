import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP verification failed:", error.message);
  } else {
    console.log("SMTP transporter verified: ready to send emails");
  }
});

async function sendOtpMail(to, otp) {
  try {
    if (!to || typeof to !== "string") throw new Error("Invalid email");
    if (!otp) throw new Error("OTP required");

    const info = await transporter.sendMail({
      from: `"Chatrix" <${process.env.SMTP_USER}>`,
      to,
      subject: "Your OTP code",
      text: `Your OTP is: ${otp}`,
      html: `<h2>Your OTP Code</h2><p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    console.log("Email sent successfully:", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
}

async function sendPasswordResetMail(to, resetLink) {
  try {
    const info = await transporter.sendMail({
      from: `"Chatrix" <${process.env.SMTP_USER}>`,
      to,
      subject: "Your reset password link is here",
      text: `Your reset password link: ${resetLink}`,
      html: `<h2>Your reset password link</h2><p>Your reset password link: <strong>${resetLink}</strong></p>`,
    });

    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
}

export { sendOtpMail, sendPasswordResetMail };
