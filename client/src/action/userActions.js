import axios from 'axios';

export const updateUserLocation = (locationData) => async (dispatch) => {
  try {
    dispatch({ type: 'location/update/pending' });
    const response = await axios.put('/api/users/location', locationData);
    dispatch({ type: 'location/update/fulfilled', payload: response.data });
  } catch (error) {
    dispatch({ type: 'location/update/rejected', error: error.message });
  }
};

export const fetchNearbyUsers = () => async (dispatch) => {
  try {
    dispatch({ type: 'location/fetchNearby/pending' });
    const response = await axios.get('/api/users/nearby');
    dispatch({ type: 'location/fetchNearby/fulfilled', payload: response.data });
  } catch (error) {
    dispatch({ type: 'location/fetchNearby/rejected', error: error.message });
  }
};

export const updateUserProfile = (profileData) => async (dispatch) => {
  try {
    const response = await axios.put('/api/users/profile', profileData);
    dispatch({ type: 'auth/updateProfile', payload: response.data });
  } catch (error) {
    dispatch({ type: 'auth/updateProfileError', error: error.message });
  }
};

export const changePassword = (passwordData) => async (dispatch) => {
  try {
    await axios.put('/api/users/change-password', passwordData);
    dispatch({ type: 'auth/passwordChanged' });
  } catch (error) {
    dispatch({ type: 'auth/passwordChangeError', error: error.message });
  }
};

export const deleteAccount = () => async (dispatch) => {
  try {
    await axios.delete('/api/users/account');
    dispatch({ type: 'auth/accountDeleted' });
  } catch (error) {
    dispatch({ type: 'auth/accountDeleteError', error: error.message });
  }
}; 