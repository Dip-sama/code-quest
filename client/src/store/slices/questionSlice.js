import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchQuestions = createAsyncThunk(
  'questions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/questions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const postQuestion = createAsyncThunk(
  'questions/post',
  async (questionData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/questions/ask', questionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to post question');
    }
  }
);

export const postAnswer = createAsyncThunk(
  'questions/postAnswer',
  async ({ id, answerBody, userAnswered }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://localhost:5000/answer/${id}`, { answerBody, userAnswered });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to post answer');
    }
  }
);

const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Post Question
      .addCase(postQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload);
      })
      .addCase(postQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Post Answer
      .addCase(postAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postAnswer.fulfilled, (state, action) => {
        state.loading = false;
        const question = state.data.find(q => q._id === action.payload._id);
        if (question) {
          question.answers = action.payload.answers;
          question.noOfAnswers = action.payload.noOfAnswers;
        }
      })
      .addCase(postAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = questionSlice.actions;
export default questionSlice.reducer; 