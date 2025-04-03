import twilio from 'twilio';
import nodemailer from 'nodemailer';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (phoneNumber, otp) => {
  try {
    await twilioClient.messages.create({
      body: `Your OTP for CodeQuest is: ${otp}. Valid for 10 minutes.`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

export const sendEmailOTP = async (email, otp) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your CodeQuest OTP',
      html: `
        <h1>Your OTP for CodeQuest</h1>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendSubscriptionEmail = async (email, subscriptionDetails) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your CodeQuest Subscription Confirmation',
      html: `
        <h1>Subscription Confirmation</h1>
        <p>Thank you for subscribing to CodeQuest!</p>
        <h2>Subscription Details:</h2>
        <ul>
          <li>Plan: ${subscriptionDetails.plan}</li>
          <li>Start Date: ${new Date(subscriptionDetails.startDate).toLocaleDateString()}</li>
          <li>End Date: ${new Date(subscriptionDetails.endDate).toLocaleDateString()}</li>
          <li>Amount: ₹${subscriptionDetails.amount}</li>
        </ul>
        <p>Your subscription is now active. You can start posting questions according to your plan limits.</p>
        <p>If you have any questions, please contact our support team.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending subscription email:', error);
    throw error;
  }
}; 