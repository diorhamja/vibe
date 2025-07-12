import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { setUser, userLocation } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const [lat, lng] = userLocation;

      const location = {
        type: 'Point',
        coordinates: [lat, lng],
      };

      const response = await axios.post('http://localhost:8000/api/users/register', {
        name,
        email,
        password,
        location,
      }, { withCredentials: true });

      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during registration.');
      }
    }
  };

  return (
      <Paper
        elevation={10}
        sx={{
          width: '100%',
          maxWidth: 420,
          padding: 5,
          borderRadius: 4,
          backgroundColor: '#fff0f6',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        }}
      >
        <Grid container justifyContent="flex-end">
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              color: '#6a5671',
              transition: '0.3s',
              '&:hover': {
                color: '#a898af',
              },
            }}
          >
            <HomeRoundedIcon fontSize="medium" />
          </IconButton>
        </Grid>

        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 550, color: '#6a5671' }}
        >
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            required
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.4,
              backgroundColor: '#6a5671',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: 3,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#a898af',
              },
            }}
          >
            Register
          </Button>

          <Typography align="center" variant="body2" sx={{ mt: 0 }}>
            Already have an account?
            <Button onClick={() => navigate('/login')} sx={{ color: '#6a5671' }}>
              Login
            </Button>
          </Typography>
        </Box>
      </Paper>
  );
};

export default Register;
