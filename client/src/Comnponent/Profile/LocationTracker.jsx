import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDispatch } from 'react-redux';
import { updateUserLocation } from '../../action/userActions';

const LocationTracker = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const getLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Get city, state, and country using reverse geocoding
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      );
      const data = await response.json();

      const locationData = {
        coordinates: { lat: latitude, lng: longitude },
        city: data.features[2]?.text || 'Unknown City',
        state: data.features[3]?.text || 'Unknown State',
        country: data.features[4]?.text || 'Unknown Country',
      };

      // Get weather data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      setLocation(locationData);
      setWeather(weatherData);

      // Update user's location in the database
      dispatch(updateUserLocation(locationData));
    } catch (err) {
      setError('Failed to get location. Please check your browser permissions.');
      console.error('Location error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Location Information
      </Typography>
      
      {!location ? (
        <Button
          variant="contained"
          color="primary"
          onClick={getLocation}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Obtain Location
        </Button>
      ) : (
        <Box>
          <Typography variant="body1" gutterBottom>
            Current Location: {location.city}, {location.state}, {location.country}
          </Typography>

          {weather && (
            <Typography variant="body1" gutterBottom>
              Weather: {weather.main.temp}°C, {weather.weather[0].description}
            </Typography>
          )}

          <Box sx={{ height: 400, mt: 2 }}>
            <Map
              mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              initialViewState={{
                longitude: location.coordinates.lng,
                latitude: location.coordinates.lat,
                zoom: 12,
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <Marker
                longitude={location.coordinates.lng}
                latitude={location.coordinates.lat}
                color="red"
              />
            </Map>
          </Box>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default LocationTracker; 