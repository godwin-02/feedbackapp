import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Rating, Stack, Paper } from "@mui/material";
import Notification from "./Notification";

const FeedbackForm = () => {
  const navigate = useNavigate();

  // State initialization
  const [name, setName] = useState(localStorage.getItem("userName") || "Guest");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });

  // Sync state if localStorage changes
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedEmail = localStorage.getItem("userEmail");
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/feedback/submit", { 
        name: name,
        userEmail: email, 
        rating: rating, 
        feedback: message 
      });

      setSnack({ open: true, msg: "Thank you for your feedback!", type: "success" });
      setTimeout(() => navigate("/reviews"), 1500);
    } catch (error) {
      setSnack({ 
        open: true, 
        msg: error.response?.data?.error || "Error submitting feedback.", 
        type: "error" 
      });
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 600, 
      mx: "auto", 
      mt: { xs: 2, md: 4 }, // Closer to top on mobile
      px: { xs: 2, sm: 3 }  // Prevents the form from touching the screen edges
    }}>
      <Button 
        onClick={() => navigate('/reviews')} 
        sx={{ mb: 2, textTransform: 'none' }} 
        color="inherit"
      >
        ← View Recent Reviews
      </Button>

      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, sm: 4 }, // Responsive padding inside the card
          borderRadius: 2 
        }}
      >
        <Typography 
          variant="h5" 
          color="primary" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', sm: '1.5rem' } // Smaller font on mobile
          }} 
          gutterBottom
        >
          Hi {name}, share your thoughts!
        </Typography>
        
        <Box component="form" onSubmit={submitFeedback} sx={{ mt: 2 }}>
          <TextField 
            fullWidth 
            label="Name" 
            value={name} 
            disabled 
            margin="normal" 
            variant="filled" 
          />
          <TextField 
            fullWidth 
            label="Email" 
            value={email} 
            disabled 
            margin="normal" 
            variant="filled" 
          />

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} // Stacks label above stars on tiny screens
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            spacing={{ xs: 1, sm: 2 }} 
            sx={{ mt: 3, mb: 1 }}
          >
            <Typography sx={{ fontWeight: 500 }}>Overall Rating:</Typography>
            <Rating 
              value={rating} 
              onChange={(e, val) => setRating(val)} 
              size="large" 
            />
          </Stack>

          <TextField
            fullWidth 
            label="Your Message" 
            multiline 
            rows={4} 
            required
            placeholder="Tell us about your experience..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            margin="normal" 
          />

          <Button 
            variant="contained" 
            color="success" 
            type="submit" 
            fullWidth 
            size="large" 
            sx={{ 
              mt: 3, 
              py: 1.5, // Taller button for easier mobile tapping
              fontWeight: 'bold' 
            }}
          >
            Submit Feedback
          </Button>
        </Box>
      </Paper>

      <Notification 
        open={snack.open} 
        message={snack.msg} 
        severity={snack.type} 
        onClose={() => setSnack({...snack, open: false})} 
      />
    </Box>
  );
};

export default FeedbackForm;