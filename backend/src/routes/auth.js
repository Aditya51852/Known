import express from "express";
import {
  sendPhoneOTP,
  verifyPhoneOTP,
  sendEmailOTP,
  verifyEmailOTP,
} from "../controllers/authController.js";

const router = express.Router();

// 📱 Phone
router.post("/phone/send-otp", sendPhoneOTP);
router.post("/phone/verify-otp", verifyPhoneOTP);

// 📧 Email
router.post("/email/send-otp", sendEmailOTP);
router.post("/email/verify-otp", verifyEmailOTP);

export default router;