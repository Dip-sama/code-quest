import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../action/authActions';

const GoogleAuth = () => {
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    try {
      // Send the credential to your backend for verification
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        dispatch(loginSuccess(data));
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Google authentication error:', error);
      // Handle error (show notification, etc.)
    }
  };

  const handleError = () => {
    console.error('Google login failed');
    // Handle error (show notification, etc.)
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="filled_blue"
          size="large"
          width="100%"
          text="continue_with"
          shape="rectangular"
          locale="en"
        />
      </GoogleOAuthProvider>
    </Box>
  );
};

export default GoogleAuth; 