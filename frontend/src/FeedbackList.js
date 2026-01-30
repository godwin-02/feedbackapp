import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Card, CardContent, Typography, Rating, Box, Grid, 
  IconButton, Button, TextField, Stack, Paper, MenuItem 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import Notification from "./Notification";

const FeedbackList = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });

  useEffect(() => { fetchFeedbacks(); }, []);

  useEffect(() => {
    let result = feedbacks;
    if (searchTerm) {
      result = result.filter(f => 
        (f.name && f.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (f.feedback && f.feedback.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    const now = new Date();
    if (dateFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(f => new Date(f.createdAt) >= weekAgo);
    }
    setFilteredFeedbacks(result);
  }, [searchTerm, dateFilter, feedbacks]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback/all");
      setFeedbacks(res.data);
      setFilteredFeedbacks(res.data);
    } catch (err) { console.error(err); }
  };

  const exportToCSV = () => {
    const headers = "Name,Email,Rating,Feedback,Date\n";
    const rows = filteredFeedbacks.map(f => {
      const dateOnly = f.createdAt ? new Date(f.createdAt).toISOString().split('T')[0] : "N/A";
      const messageContent = f.feedback || ""; 
      const safeMsg = messageContent.replace(/"/g, '""'); 
      return `${f.name},${f.userEmail},${f.rating},"${safeMsg}",${dateOnly}`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `Feedback_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/feedback/${id}`);
      setFeedbacks(feedbacks.filter((f) => f._id !== id));
      setSnack({ open: true, msg: "Deleted successfully", type: "success" });
    } catch (err) { 
      setSnack({ open: true, msg: "Delete failed", type: "error" }); 
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}> {/* Responsive padding */}
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          fontSize: { xs: '1.5rem', sm: '2.125rem' } 
        }}
      >
        Customer Reviews
      </Typography>
      
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Full width on mobile, 1/3 width on desktop */}
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Search..." 
              onChange={(e) => setSearchTerm(e.target.value)} 
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} /> }} 
            />
          </Grid>
          
          {/* Half width on tablet, 1/3 width on desktop */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField 
              select 
              fullWidth 
              size="small" 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)} 
              label="Date Filter"
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth // Full width on mobile for easier tapping
              startIcon={<DownloadIcon />} 
              onClick={exportToCSV}
            >
              Export to CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        {filteredFeedbacks.length === 0 ? (
          <Typography sx={{ m: 2, color: 'gray' }}>No reviews found.</Typography>
        ) : (
          filteredFeedbacks.map((f) => (
            <Grid item xs={12} key={f._id}>
              <Card variant="outlined" sx={{ borderLeft: '6px solid #1976d2' }}>
                <CardContent>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} // Stacks content on mobile
                    justifyContent="space-between" 
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={1}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                        {f.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {f.userEmail}
                      </Typography>
                    </Box>
                    <Rating value={f.rating || 0} readOnly size="small" />
                  </Stack>

                  <Typography variant="body1" sx={{ mt: 2, mb: 2, fontStyle: 'italic', wordBreak: 'break-word' }}>
                    "{f.feedback}"
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 1 
                  }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ""}
                    </Typography>
                    <IconButton 
                      color="error" 
                      onClick={() => deleteFeedback(f._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      
      <Notification 
        open={snack.open} 
        message={snack.msg} 
        severity={snack.type} 
        onClose={() => setSnack({...snack, open: false})} 
      />
    </Box>
  );
};

export default FeedbackList;