import axios from 'axios';

export const fetchPosts = () => async (dispatch) => {
  try {
    dispatch({ type: 'social/fetchPosts/pending' });
    const response = await axios.get('/api/social/posts');
    dispatch({ type: 'social/fetchPosts/fulfilled', payload: response.data });
  } catch (error) {
    dispatch({ type: 'social/fetchPosts/rejected', error: error.message });
  }
};

export const createPost = (postData) => async (dispatch) => {
  try {
    dispatch({ type: 'social/createPost/pending' });
    const response = await axios.post('/api/social/posts', postData);
    dispatch({ type: 'social/createPost/fulfilled', payload: response.data });
  } catch (error) {
    dispatch({ type: 'social/createPost/rejected', error: error.message });
  }
};

export const likePost = (postId) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/social/posts/${postId}/like`);
    dispatch({ type: 'social/likePost/fulfilled', payload: response.data });
  } catch (error) {
    dispatch({ type: 'social/likePost/rejected', error: error.message });
  }
};

export const commentOnPost = (postId, comment) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/social/posts/${postId}/comments`, { comment });
    dispatch({ type: 'social/commentOnPost/fulfilled', payload: response.data });
  } catch (error) {
    dispatch({ type: 'social/commentOnPost/rejected', error: error.message });
  }
};

export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(`/api/social/posts/${postId}`);
    dispatch({ type: 'social/deletePost/fulfilled', payload: postId });
  } catch (error) {
    dispatch({ type: 'social/deletePost/rejected', error: error.message });
  }
};

export const sharePost = (postId) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/social/posts/${postId}/share`);
    dispatch({ type: 'social/sharePost/fulfilled', payload: response.data });
  } catch (error) {
    dispatch({ type: 'social/sharePost/rejected', error: error.message });
  }
}; 