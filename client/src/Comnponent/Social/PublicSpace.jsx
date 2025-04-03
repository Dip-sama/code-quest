import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ThumbUp,
  Comment,
  Share,
  Image as ImageIcon,
  VideoLibrary,
  Send,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import { createPost, likePost, commentOnPost, sharePost } from '../../action/socialActions';

const PublicSpace = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { posts, user } = useSelector((state) => state.social);
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.webm'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
  });

  const handlePost = async () => {
    if (!newPost.trim() && !selectedFile) return;

    const formData = new FormData();
    formData.append('content', newPost);
    if (selectedFile) {
      formData.append('media', selectedFile);
    }

    await dispatch(createPost(formData));
    setNewPost('');
    setSelectedFile(null);
    setOpenDialog(false);
  };

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const handleComment = async (postId) => {
    if (!comment.trim()) return;
    await dispatch(commentOnPost(postId, comment));
    setComment('');
  };

  const handleShare = (postId) => {
    dispatch(sharePost(postId));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Public Space
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          startIcon={<Send />}
        >
          Create Post
        </Button>
      </Paper>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} key={post._id}>
            <Card>
              {post.media && (
                <CardMedia
                  component={post.mediaType === 'video' ? 'video' : 'img'}
                  height="300"
                  src={post.mediaUrl}
                  controls={post.mediaType === 'video'}
                />
              )}
              <CardContent>
                <Typography variant="body1">{post.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Posted by {post.author.name} on{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleLike(post._id)}>
                  <ThumbUp color={post.likes.includes(user._id) ? 'primary' : 'inherit'} />
                </IconButton>
                <Typography variant="body2">{post.likes.length}</Typography>
                <IconButton onClick={() => setSelectedPost(post)}>
                  <Comment />
                </IconButton>
                <Typography variant="body2">{post.comments.length}</Typography>
                <IconButton onClick={() => handleShare(post._id)}>
                  <Share />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="What's on your mind?"
            fullWidth
            multiline
            rows={4}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <Box
            {...getRootProps()}
            sx={{
              mt: 2,
              p: 3,
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 1,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <Typography>{selectedFile.name}</Typography>
            ) : (
              <Typography>
                Drag and drop an image or video here, or click to select
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handlePost} variant="contained" color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          {selectedPost?.comments.map((comment, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{comment.author.name}</Typography>
              <Typography variant="body2">{comment.content}</Typography>
            </Box>
          ))}
          <TextField
            autoFocus
            margin="dense"
            label="Add a comment"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPost(null)}>Close</Button>
          <Button
            onClick={() => handleComment(selectedPost?._id)}
            variant="contained"
            color="primary"
          >
            Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PublicSpace; 