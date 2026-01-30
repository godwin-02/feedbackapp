const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Login Route - FIXED
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (user) {
      // We MUST send the object so res.data.name exists on the frontend
      res.status(200).json(user); 
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser); // Return the user so they can be logged in immediately
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;