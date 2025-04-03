import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPosts = createAsyncThunk(
  'social/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/social/posts');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPost = createAsyncThunk(
  'social/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/social/posts', postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const likePost = createAsyncThunk(
  'social/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/social/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const commentOnPost = createAsyncThunk(
  'social/commentOnPost',
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/social/posts/${postId}/comments`, { comment });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  posts: [],
  loading: false,
  error: null,
  selectedPost: null,
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch posts';
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create post';
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload._id);
        if (post) {
          post.likes = action.payload.likes;
        }
      })
      // Comment on Post
      .addCase(commentOnPost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload._id);
        if (post) {
          post.comments = action.payload.comments;
        }
      });
  },
});

export const { setSelectedPost, clearError } = socialSlice.actions;
export default socialSlice.reducer; 