import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const Questions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [questionData, setQuestionData] = useState({
    title: '',
    content: '',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/questions');
      setQuestions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch questions. Please try again later.');
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    if (!user) {
      toast.error('Please log in to ask a question');
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setQuestionData({
      title: '',
      content: '',
      tags: [],
    });
  };

  const handleChange = (e) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag && !questionData.tags.includes(newTag)) {
      setQuestionData({
        ...questionData,
        tags: [...questionData.tags, newTag],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setQuestionData({
      ...questionData,
      tags: questionData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/questions/ask', {
        ...questionData,
        userId: user.id,
      });
      toast.success('Question posted successfully!');
      setQuestions([data, ...questions]);
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post question');
    }
  };

  const handleLike = async (questionId) => {
    if (!user) {
      toast.error('Please log in to like questions');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/questions/${questionId}/like`);
      fetchQuestions(); // Refresh questions to get updated like count
    } catch (error) {
      toast.error('Failed to like question');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Top Questions
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Ask Question
          </Button>
        </Box>

        {questions.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
            No questions found. Be the first to ask a question!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {questions.map((question) => (
              <Grid item xs={12} key={question._id || question.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {question.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {question.content}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {question.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      Asked by {question.author?.name || 'Anonymous'} on{' '}
                      {new Date(question.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton size="small" onClick={() => handleLike(question._id || question.id)}>
                      <ThumbUpIcon color={question.likes?.includes(user?.id) ? 'primary' : 'inherit'} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {question.likes?.length || 0}
                      </Typography>
                    </IconButton>
                    <IconButton size="small">
                      <CommentIcon />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {question.comments?.length || 0}
                      </Typography>
                    </IconButton>
                    <IconButton size="small">
                      <ShareIcon />
                    </IconButton>
                    <IconButton size="small">
                      <BookmarkIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Ask a Question</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={questionData.title}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Content"
                name="content"
                multiline
                rows={6}
                value={questionData.content}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Box component="form" onSubmit={handleAddTag} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Add Tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  helperText="Press Enter to add a tag"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {questionData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Post Question
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Questions; 