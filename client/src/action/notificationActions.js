import axios from 'axios';

export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: 'notifications/fetchNotifications/pending' });
    const response = await axios.get('/api/notifications');
    dispatch({ type: 'notifications/fetchNotifications/fulfilled', payload: response.data });
  } catch (error) {
    dispatch({ type: 'notifications/fetchNotifications/rejected', error: error.message });
  }
};

export const markAsRead = (notificationId) => async (dispatch) => {
  try {
    const response = await axios.put(`/api/notifications/${notificationId}/read`);
    dispatch({ type: 'notifications/markAsRead/fulfilled', payload: response.data });
  } catch (error) {
    dispatch({ type: 'notifications/markAsRead/rejected', error: error.message });
  }
};

export const updateNotificationSettings = (settings) => async (dispatch) => {
  try {
    const response = await axios.put('/api/notifications/settings', settings);
    dispatch({ type: 'notifications/updateSettings/fulfilled', payload: response.data });
  } catch (error) {
    dispatch({ type: 'notifications/updateSettings/rejected', error: error.message });
  }
};

export const addNotification = (notification) => (dispatch) => {
  dispatch({ type: 'notifications/addNotification', payload: notification });
}; 