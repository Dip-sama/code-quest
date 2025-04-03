import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, sendOTP } from '../utils/otp.js';
import { detectBrowser } from '../utils/browserDetector.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth verification
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    // Check if user exists
    let user = await User.findOne({ email: payload.email });
    
    if (!user) {
      // Create new user
      user = new User({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub,
        loginHistory: [{
          timestamp: new Date(),
          browser: detectBrowser(req.headers['user-agent']),
          ip: req.ip,
        }],
      });
      await user.save();
    } else {
      // Update login history
      user.loginHistory.push({
        timestamp: new Date(),
        browser: detectBrowser(req.headers['user-agent']),
        ip: req.ip,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// Phone number authentication
router.post('/phone', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const otp = generateOTP();
    
    // Store OTP in user's document or cache
    await User.findOneAndUpdate(
      { phoneNumber },
      { $set: { otp, otpExpires: new Date(Date.now() + 10 * 60 * 1000) } },
      { upsert: true }
    );

    // Send OTP via SMS
    await sendOTP(phoneNumber, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Phone auth error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    const user = await User.findOne({
      phoneNumber,
      otp,
      otpExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

export default router; 