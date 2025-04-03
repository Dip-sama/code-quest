import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { VideoLibrary, Upload } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import ReactPlayer from 'react-player';
import OTPInput from 'react-otp-input';
import { useSelector } from 'react-redux';

const VideoUpload = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.webm'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Check file size
        if (file.size > 50 * 1024 * 1024) {
          setError('Video size must be less than 50MB');
          return;
        }

        // Create video element to check duration
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 120) { // 2 minutes
            setError('Video duration must be less than 2 minutes');
            return;
          }
          setSelectedFile(file);
          setPreview(URL.createObjectURL(file));
        };
        video.src = URL.createObjectURL(file);
      }
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Check if current time is between 2 PM and 7 PM
    const now = new Date();
    const hour = now.getHours();
    if (hour < 14 || hour >= 19) {
      setError('Video uploads are only allowed between 2 PM and 7 PM');
      return;
    }

    setShowOTPDialog(true);
  };

  const handleOTPVerification = async () => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('otp', otp);

      const response = await fetch('/api/questions/video-upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setSelectedFile(null);
        setPreview(null);
        setShowOTPDialog(false);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      setError(error.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <VideoLibrary sx={{ mr: 1 }} />
        <Typography variant="h6">Upload Video Question</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Video uploaded successfully!
        </Alert>
      )}

      <Box
        {...getRootProps()}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 1,
          textAlign: 'center',
          cursor: 'pointer',
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        {selectedFile ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              Selected file: {selectedFile.name}
            </Typography>
            <ReactPlayer
              url={preview}
              controls
              width="100%"
              height="auto"
              style={{ maxHeight: '300px' }}
            />
          </Box>
        ) : (
          <Typography>
            Drag and drop a video here, or click to select
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        startIcon={uploading ? <CircularProgress size={20} /> : <Upload />}
      >
        Upload Video
      </Button>

      <Dialog open={showOTPDialog} onClose={() => setShowOTPDialog(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please enter the OTP sent to your email to verify the upload.
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
            onClick={handleOTPVerification}
            variant="contained"
            color="primary"
            disabled={otp.length !== 6 || uploading}
          >
            {uploading ? <CircularProgress size={24} /> : 'Verify & Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default VideoUpload; 