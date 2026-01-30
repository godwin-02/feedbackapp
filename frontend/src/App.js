import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Container, Box, Typography } from '@mui/material';
import Login from './Login';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 4 }}>
            Feedback Portal
          </Typography>
          
          <Routes>
            {}
            <Route path="/" element={<Login />} />
            
            {}
            <Route path="/feedback" element={<FeedbackForm />} />
            
            {}
            <Route path="/reviews" element={<FeedbackList />} />
            
            {}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  ); 
}

export default App;