 import client from "../config/twilio.js";
import transporter from "../config/mailer.js";
import { saveOTP, verifyOTP } from "../utils/otpStore.js";

// 🔹 Generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000);

// ==================== PHONE ====================

export const sendPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    const otp = generateOTP();
    saveOTP(phone, otp);

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send phone OTP" });
  }
};

export const verifyPhoneOTP = (req, res) => {
  const { phone, otp } = req.body;

  const isValid = verifyOTP(phone, otp);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  res.json({ success: true, type: "phone" });
};

// ==================== EMAIL ====================

export const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOTP();
    saveOTP(email, otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to send email OTP" });
  }
};

export const verifyEmailOTP = (req, res) => {
  const { email, otp } = req.body;

  const isValid = verifyOTP(email, otp);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  res.json({ success: true, type: "email" });
};