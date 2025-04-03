import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Send, SmartToy } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import OTPInput from 'react-otp-input';

const Chatbot = () => {
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const question = input.trim();
    setInput('');
    setCurrentQuestion(question);

    // Check if it's a Java-related question
    if (question.toLowerCase().includes('java')) {
      setMessages((prev) => [
        ...prev,
        { type: 'user', content: question },
        { type: 'bot', content: "I apologize, but I cannot answer Java-related questions." },
      ]);
      return;
    }

    // Show OTP dialog if not already verified
    if (!otpSent) {
      setShowOTPDialog(true);
      return;
    }

    // Send message to backend
    setLoading(true);
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ question, otp }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { type: 'user', content: question },
          { type: 'bot', content: data.response },
        ]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: 'user', content: question },
        { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await fetch('/api/chatbot/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.ok) {
        setOtpSent(true);
        setShowOTPDialog(false);
        // Send the question after OTP is sent
        handleSendMessage();
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SmartToy sx={{ mr: 1 }} />
        <Typography variant="h6">Programming Assistant</Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <Paper
              sx={{
                p: 2,
                backgroundColor: message.type === 'user' ? 'primary.light' : 'grey.100',
                color: message.type === 'user' ? 'white' : 'text.primary',
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a programming question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={loading}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
        >
          <Send />
        </IconButton>
      </Box>

      <Dialog open={showOTPDialog} onClose={() => setShowOTPDialog(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please enter the OTP sent to your email to continue.
          </Typography>
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => (
              <input
                {...props}
                style={{
                  width: '40px',
                  height: '40px',
                  margin: '0 4px',
                  fontSize: '16px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOTPDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSendOTP}
            variant="contained"
            color="primary"
            disabled={otp.length !== 6}
          >
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Chatbot; 