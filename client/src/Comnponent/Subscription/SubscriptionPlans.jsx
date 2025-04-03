import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  WorkspacePremium as WorkspacePremiumIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

// Initialize Stripe with error handling
const getStripe = () => {
  const key = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
  if (!key) {
    console.error('Stripe public key is not configured in environment variables');
    return null;
  }
  return loadStripe(key);
};

const stripePromise = getStripe();

const plans = [
  {
    name: 'Free',
    price: '0',
    features: ['1 question per day'],
    color: 'grey.500',
    icon: <StarIcon />,
  },
  {
    name: 'Bronze',
    price: '100',
    features: ['5 questions per day', 'Priority support'],
    color: 'brown.500',
    icon: <EmojiEventsIcon />,
  },
  {
    name: 'Silver',
    price: '300',
    features: ['10 questions per day', 'Priority support', 'Advanced analytics'],
    color: 'grey.400',
    icon: <EmojiEventsIcon />,
  },
  {
    name: 'Gold',
    price: '1000',
    features: ['Unlimited questions', 'Priority support', 'Advanced analytics', 'Exclusive content'],
    color: 'amber.500',
    icon: <WorkspacePremiumIcon />,
  },
];

const CheckoutForm = ({ plan, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      onError('Stripe is not properly configured. Please try again later.');
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        onError(error.message);
        return;
      }

      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          plan: plan.name.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data);
      } else {
        throw new Error(data.message || 'Payment failed');
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={!stripe || loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : `Subscribe to ${plan.name} Plan`}
      </Button>
    </form>
  );
};

const SubscriptionPlans = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (plan) => {
    if (!stripePromise) {
      setError('Payment system is not properly configured. Please try again later.');
      return;
    }

    if (!user) {
      setError('Please log in to subscribe to a plan');
      return;
    }

    // Check if current time is between 10 AM and 11 AM
    const now = new Date();
    const hour = now.getHours();
    if (hour < 10 || hour >= 11) {
      setError('Subscriptions can only be processed between 10 AM and 11 AM');
      return;
    }

    setSelectedPlan(plan);
    setError(null);
    setSuccess(false);
  };

  const handleSuccess = (data) => {
    setSuccess(true);
    setSelectedPlan(null);
    toast.success('Subscription successful! Thank you for your purchase.');
  };

  const handleError = (message) => {
    setError(message);
    toast.error(message);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Choose Your Plan
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Subscription successful! Thank you for your purchase.
        </Alert>
      )}

      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={3} key={plan.name}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: selectedPlan?.name === plan.name ? `2px solid ${theme.palette.primary.main}` : 'none',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: plan.color, mr: 1 }}>{plan.icon}</Box>
                  <Typography variant="h5" component="h2">
                    {plan.name}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" gutterBottom>
                  ₹{plan.price}
                  <Typography component="span" variant="body2" color="text.secondary">
                    /month
                  </Typography>
                </Typography>
                <List>
                  {plan.features.map((feature) => (
                    <ListItem key={feature}>
                      <ListItemIcon>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubscribe(plan)}
                  disabled={plan.name === 'Free'}
                >
                  {plan.name === 'Free' ? 'Current Plan' : 'Subscribe'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedPlan && selectedPlan.name !== 'Free' && stripePromise && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              plan={selectedPlan}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </Elements>
        </Paper>
      )}
    </Box>
  );
};

export default SubscriptionPlans; 