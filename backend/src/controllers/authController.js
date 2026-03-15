const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * @desc    Google OAuth login/registration
 * @route   POST /api/auth/google
 * @access  Public
 */
exports.googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        error: { message: 'Google ID token is required' } 
      });
    }

    let payload;
    try {
      // Try verifying it as an ID Token first
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      // If verification fails, it might be an Access Token (e.g. from useGoogleLogin implicit flow)
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!userInfoResponse.ok) {
        return res.status(401).json({ 
          error: { message: 'Invalid or expired Google token' } 
        });
      }
      payload = await userInfoResponse.json();
    }

    // Extract user data from payload
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    if (!googleId || !email) {
      return res.status(400).json({ 
        error: { message: 'Invalid Google payload: missing googleId or email' } 
      });
    }

    // Check if user already exists
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if a user with the same email already exists to link accounts (optional but best practice)
      // For this implementation, we follow the requirement to create if googleId not found.
      const existingEmailUser = await User.findOne({ email });
      
      if (existingEmailUser) {
        // Link Google ID to existing user Account
        existingEmailUser.googleId = googleId;
        if (!existingEmailUser.name && name) {
          existingEmailUser.name = name;
        }
        if (!existingEmailUser.avatar && picture) {
          existingEmailUser.avatar = picture;
        }
        await existingEmailUser.save();
        user = existingEmailUser;
      } else {
        // If not: create a new user
        user = await User.create({
          googleId,
          email,
          name,
          avatar: picture,
          role: 'client',
          profileComplete: false
        });
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return response
    return res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        profileComplete: user.profileComplete
      }
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(401).json({ 
      error: { 
        message: 'Invalid or expired Google token', 
        details: error.message 
      } 
    });
  }
};
