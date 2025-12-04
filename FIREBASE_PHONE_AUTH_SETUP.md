# Firebase Phone Authentication Setup Guide

## ⚠️ CRITICAL: OTP Not Arriving - Checklist

### 1. Enable Phone Authentication in Firebase Console

**This is the #1 reason OTP doesn't work!**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **known-9851c**
3. Click **Authentication** in the left sidebar
4. Click **Sign-in method** tab
5. Find **Phone** in the list
6. Click on **Phone** to expand it
7. Toggle **Enable** to ON
8. Click **Save**

### 2. Verify Authorized Domains

1. In Authentication, click **Settings** tab
2. Scroll to **Authorized domains**
3. Ensure these domains are listed:
   - `localhost` (for development)
   - `known-9851c.firebaseapp.com` (default)
   - Add your production domain if deploying

### 3. Check Firebase Project Billing

**Important:** Phone authentication requires:
- **Spark Plan (Free)**: Limited SMS per day (~10-50 SMS/day depending on region)
- **Blaze Plan (Pay-as-you-go)**: Higher limits, charged per SMS

To check/upgrade:
1. Go to Firebase Console → Settings (gear icon) → Usage and billing
2. Check your current plan
3. If on Spark plan and hitting limits, upgrade to Blaze

### 4. Add Test Phone Numbers (For Development)

To test without consuming SMS quota:

1. Go to Authentication → Sign-in method → Phone
2. Scroll down to **Phone numbers for testing**
3. Click **Add phone number**
4. Add: `+911234567890` with test code: `123456`
5. Click **Add**

Now you can use +911234567890 and it will always accept 123456 as OTP (no real SMS sent)

### 5. Regional SMS Restrictions

Some regions have restrictions:
- India: SMS delivery can be delayed or blocked by carriers
- Try using a different carrier/SIM card
- Check if your number is on DND (Do Not Disturb) list

### 6. Firebase Console SMS Quota

Check if you've exceeded quota:
1. Go to Firebase Console → Authentication → Usage
2. Check "Phone sign-in" usage
3. If exceeded, wait 24 hours or upgrade to Blaze plan

## 🐛 Debugging Steps

### Step 1: Check Browser Console

1. Open your app in browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try sending OTP
5. Look for these messages:

**Success messages:**
```
RecaptchaVerifier initialized successfully
Attempting to send OTP to: +91XXXXXXXXXX
reCAPTCHA solved successfully
OTP sent successfully, confirmation result: [object]
```

**Error messages:**
```
Error code: auth/invalid-phone-number
Error code: auth/too-many-requests
Error code: auth/quota-exceeded
Error code: auth/captcha-check-failed
Error code: auth/missing-phone-number
```

### Step 2: Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/invalid-phone-number` | Wrong format | Use +91 followed by 10 digits |
| `auth/too-many-requests` | Rate limited | Wait 1 hour or use test number |
| `auth/quota-exceeded` | SMS quota exceeded | Upgrade to Blaze plan |
| `auth/captcha-check-failed` | reCAPTCHA failed | Refresh page and try again |
| `auth/missing-phone-number` | No number provided | Check input field |
| `auth/operation-not-allowed` | **Phone auth not enabled** | Enable in Firebase Console |

### Step 3: Test with Test Phone Number

1. Add test number in Firebase Console (see step 4 above)
2. Use `+911234567890` in your app
3. Enter test code `123456` when prompted
4. This confirms your code works without real SMS

### Step 4: Check Network Tab

1. Open Developer Tools → **Network** tab
2. Try sending OTP
3. Look for requests to:
   - `identitytoolkit.googleapis.com`
   - `www.google.com/recaptcha`
4. Check if any requests fail (red color)

## 🔧 Quick Fix Commands

### Restart Development Server
```bash
cd frontend
npm run dev
```

### Clear Browser Cache
1. Press **Ctrl + Shift + Delete**
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page

### Check Firebase SDK Version
```bash
cd frontend
npm list firebase
```

Should show: `firebase@11.1.0` ✅

## 📱 Testing Checklist

- [ ] Phone authentication enabled in Firebase Console
- [ ] Authorized domains include localhost
- [ ] Test phone number added (optional but recommended)
- [ ] Browser console shows no errors
- [ ] reCAPTCHA initializes successfully
- [ ] Using correct phone format: +91XXXXXXXXXX
- [ ] Not on DND list (for real SMS)
- [ ] SMS quota not exceeded

## 🆘 Still Not Working?

### Try These:

1. **Use Incognito/Private Window**
   - Eliminates cache/extension issues

2. **Try Different Browser**
   - Chrome, Firefox, Edge

3. **Check Firebase Status**
   - Visit: https://status.firebase.google.com/
   - Check if there are any ongoing issues

4. **Verify Firebase Config**
   - File: `frontend/src/firebase.ts`
   - Ensure all config values are correct

5. **Enable Debug Logging**
   - Already added in PhoneOtpLogin.tsx
   - Check console for detailed logs

## 📞 Contact Firebase Support

If nothing works:
1. Go to Firebase Console
2. Click "?" icon → "Contact Support"
3. Describe the issue with error codes from console

## ✅ Expected Flow

When everything works correctly:

1. User enters phone number
2. Console logs: "RecaptchaVerifier initialized successfully"
3. User clicks "Send OTP"
4. Console logs: "Attempting to send OTP to: +91XXXXXXXXXX"
5. Console logs: "reCAPTCHA solved successfully"
6. Console logs: "OTP sent successfully"
7. **SMS arrives within 10-30 seconds**
8. User enters OTP
9. User is authenticated

---

**Most Common Issue:** Phone authentication not enabled in Firebase Console (Step 1)
**Second Most Common:** SMS quota exceeded (upgrade to Blaze plan)
**Third Most Common:** Phone number on DND list (use test number)
