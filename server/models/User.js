import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: String,
  picture: String,
  googleId: String,
  otp: String,
  otpExpires: Date,
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'bronze', 'silver', 'gold'],
      default: 'free',
    },
    startDate: Date,
    endDate: Date,
  },
  loginHistory: [{
    timestamp: Date,
    browser: String,
    ip: String,
    device: String,
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  notifications: [{
    type: {
      type: String,
      enum: ['answer', 'upvote', 'friend_request', 'subscription'],
    },
    message: String,
    timestamp: Date,
    read: {
      type: Boolean,
      default: false,
    },
  }],
  notificationSettings: {
    enabled: {
      type: Boolean,
      default: true,
    },
    types: {
      answers: { type: Boolean, default: true },
      upvotes: { type: Boolean, default: true },
      friendRequests: { type: Boolean, default: true },
      subscription: { type: Boolean, default: true },
    },
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ 'loginHistory.timestamp': -1 });

// Virtual for post limit based on subscription and friends
userSchema.virtual('dailyPostLimit').get(function() {
  const now = new Date();
  const isSubscriptionActive = this.subscription.endDate && this.subscription.endDate > now;
  
  if (isSubscriptionActive) {
    switch (this.subscription.plan) {
      case 'gold':
        return Infinity;
      case 'silver':
        return 10;
      case 'bronze':
        return 5;
      default:
        return 1;
    }
  }
  
  // Free plan: 1 post per friend (max 2) or 1 post if no friends
  return Math.max(1, Math.min(2, this.friends.length));
});

const User = mongoose.model('User', userSchema);

export default User; 