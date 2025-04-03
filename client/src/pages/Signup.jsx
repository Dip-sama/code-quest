import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { loginUser, googleLogin } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await dispatch(loginUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })).unwrap();
      toast.success('Signup successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Signup failed');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await dispatch(googleLogin()).unwrap();
      toast.success('Google signup successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Google signup failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sign Up
          </Typography>
          {auth.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {auth.error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={auth.loading}
              sx={{ mt: 3 }}
            >
              {auth.loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </form>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignup}
            sx={{ mt: 2 }}
          >
            Sign Up with Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup; 