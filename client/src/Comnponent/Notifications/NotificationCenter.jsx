import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  ThumbUp as ThumbUpIcon,
  PersonAdd as PersonAddIcon,
  CardMembership as CardMembershipIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { updateNotificationSettings, markAsRead } from '../../action/notificationActions';

const NotificationCenter = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { notifications, settings } = useSelector((state) => state.notifications);
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        setPermission(permission);
      });
    }
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await dispatch(markAsRead(notification._id));
    }
    setOpen(false);
  };

  const handleSettingsChange = async (type, enabled) => {
    await dispatch(updateNotificationSettings({ [type]: enabled }));
  };

  const showBrowserNotification = (notification) => {
    if (permission === 'granted' && settings.enabled && settings.types[notification.type]) {
      new Notification('CodeQuest Notification', {
        body: notification.message,
        icon: '/logo192.png',
      });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'answer':
        return <CheckCircleIcon color="primary" />;
      case 'upvote':
        return <ThumbUpIcon color="primary" />;
      case 'friend_request':
        return <PersonAddIcon color="primary" />;
      case 'subscription':
        return <CardMembershipIcon color="primary" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => setOpen(true)}
        sx={{ position: 'relative' }}
      >
        <Badge
          badgeContent={notifications.filter((n) => !n.read).length}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Notifications</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <NotificationsIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification._id}
                button
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  backgroundColor: notification.read ? 'inherit' : 'action.hover',
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Notification Settings
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enabled}
                  onChange={(e) => handleSettingsChange('enabled', e.target.checked)}
                />
              }
              label="Enable Browser Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.types.answers}
                  onChange={(e) => handleSettingsChange('answers', e.target.checked)}
                />
              }
              label="Answer Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.types.upvotes}
                  onChange={(e) => handleSettingsChange('upvotes', e.target.checked)}
                />
              }
              label="Upvote Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.types.friendRequests}
                  onChange={(e) => handleSettingsChange('friendRequests', e.target.checked)}
                />
              }
              label="Friend Request Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.types.subscription}
                  onChange={(e) => handleSettingsChange('subscription', e.target.checked)}
                />
              }
              label="Subscription Notifications"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationCenter; 