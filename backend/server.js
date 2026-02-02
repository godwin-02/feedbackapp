require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Standard Middleware
app.use(cors()); 
app.use(express.json());

// MongoDB Connection Logic
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Feedback DB Connected (Compass)"))
  .catch(err => console.error("❌ Feedback DB Connection Error:", err));

// Routes
const userRoutes = require("./user");
const feedbackRoutes = require("./feedback");

app.use("/api/users", userRoutes);
app.use("/api/feedback", feedbackRoutes);

// Stay on 5000 - E-commerce is now on 5005
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Feedback Server running on port ${PORT}`);
  console.log(`👉 Note: E-commerce should be running on 5005`);
});

module.exports = app;