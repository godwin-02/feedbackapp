import React, { useState } from 'react';
import { TextField, Button, Paper, Box, ToggleButton, ToggleButtonGroup, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';

const Login = () => {
  const [mode, setMode] = useState('login'); 
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [notify, setNotify] = useState({ open: false, msg: '', type: 'success' });
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = mode === 'login' ? '/api/users/login' : '/api/users/register';
    
    try {
      // FIX: http://localhost:5000 ah remove panniyaachu. 
      // Ippo it uses relative path, which works on both local and Vercel.
      const res = await axios.post(endpoint, form); 
      
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userEmail", res.data.email);

      setNotify({ 
        open: true, 
        msg: mode === 'login' ? `Welcome back, ${res.data.name}!` : "Registration Successful!", 
        type: 'success' 
      });

      setTimeout(() => {
        if (res.data.role === 'admin') {
          navigate('/reviews');
        } else {
          navigate('/feedback');
        }
      }, 1500);

    } catch (err) {
      setNotify({ 
        open: true, 
        msg: "Authentication failed. Check your credentials.", 
        type: 'error' 
      });
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh', 
      px: 2 
    }}>
      <Paper 
        elevation={4} 
        sx={{ 
          p: { xs: 3, sm: 4 }, 
          width: '100%', 
          maxWidth: 400, 
          borderRadius: 3,
          mt: { xs: 2, sm: 0 } 
        }}
      >
        <Typography 
          variant="h5" 
          align="center" 
          sx={{ mb: 3, fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Typography>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, m) => m && setMode(m)}
          fullWidth
          sx={{ mb: 3 }}
          color="primary"
        >
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="register">Register</ToggleButton>
        </ToggleButtonGroup>
        
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {mode === 'register' && (
              <TextField 
                label="Name" 
                fullWidth 
                required 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})} 
              />
            )}
            <TextField 
              label="Email" 
              type="email" 
              fullWidth 
              required 
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})} 
            />
            <TextField 
              label="Password" 
              type="password" 
              fullWidth 
              required 
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})} 
            />
            <Button 
              variant="contained" 
              fullWidth 
              size="large" 
              type="submit" 
              sx={{ 
                mt: 1, 
                py: 1.5, 
                fontWeight: 'bold' 
              }}
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Notification 
        open={notify.open} 
        message={notify.msg} 
        severity={notify.type} 
        onClose={() => setNotify({ ...notify, open: false })} 
      />
    </Box>
  );
};

export default Login;