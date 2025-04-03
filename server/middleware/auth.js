import jwt from "jsonwebtoken"
import { isAllowedBrowser, isAllowedTime, isAllowedVideoUploadTime } from '../utils/browserDetector.js';
import { generateOTP, sendEmailOTP } from '../utils/otp.js';
import User from '../models/User.js';

const auth=(req,res,next)=>{
    try {
        const token =req.headers.authorization.split(" ")[1];
        let decodedata=jwt.verify(token,process.env.JWT_SECRET)
        req.userid=decodedata?.id;
        next();
    } catch (error) {
        console.log(error)
    }
}

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check browser and time restrictions
    if (!isAllowedBrowser(req.headers['user-agent'])) {
      // Generate and send OTP for Chrome users
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      await sendEmailOTP(user.email, otp);
      return res.status(403).json({ 
        message: 'OTP verification required for Chrome browser',
        requiresOTP: true 
      });
    }

    if (!isAllowedTime(req.headers['user-agent'])) {
      return res.status(403).json({ 
        message: 'Access restricted at this time',
        restricted: true 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = await User.findOne({
      _id: req.user._id,
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

    next();
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

export const checkVideoUploadTime = (req, res, next) => {
  if (!isAllowedVideoUploadTime()) {
    return res.status(403).json({ 
      message: 'Video uploads are only allowed between 2 PM and 7 PM',
      restricted: true 
    });
  }
  next();
};

export const checkSubscriptionTime = (req, res, next) => {
  if (!isAllowedTime(req.headers['user-agent'])) {
    return res.status(403).json({ 
      message: 'Subscriptions can only be processed between 10 AM and 11 AM',
      restricted: true 
    });
  }
  next();
};

export default auth;