const otpStore = new Map();

export function saveOTP(key, otp) {
  otpStore.set(key, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
}

export function verifyOTP(key, otp) {
  const record = otpStore.get(key);

  if (!record) return false;
  if (Date.now() > record.expiresAt) return false;

  return record.otp === otp;
}