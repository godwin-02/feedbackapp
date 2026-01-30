const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: String,
  userEmail: String,
  rating: Number,
  feedback: String, // Ensure this matches the frontend 'feedback' key
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

// GET all feedback
router.get("/all", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SUBMIT feedback
router.post("/submit", async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE feedback - FIXED
router.delete("/:id", async (req, res) => {
  try {
    const result = await Feedback.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;