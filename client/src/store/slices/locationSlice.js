import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateUserLocation = createAsyncThunk(
  'location/update',
  async (locationData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/users/location', locationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchNearbyUsers = createAsyncThunk(
  'location/fetchNearby',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/users/nearby');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  currentLocation: null,
  nearbyUsers: [],
  loading: false,
  error: null,
  weather: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setWeather: (state, action) => {
      state.weather = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Location
      .addCase(updateUserLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLocation = action.payload.location;
      })
      .addCase(updateUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update location';
      })
      // Fetch Nearby Users
      .addCase(fetchNearbyUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyUsers = action.payload;
      })
      .addCase(fetchNearbyUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch nearby users';
      });
  },
});

export const { setCurrentLocation, setWeather, clearError } = locationSlice.actions;
export default locationSlice.reducer; 