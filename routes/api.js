const express = require("express");
const RepCounter = require("../models/RepCounter");
const router = express.Router();

// Endpoint to get the current rep count
router.get("/rep-count", async (req, res) => {
  try {
    const counter = await RepCounter.findOne();
    res.json(counter);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rep count" });
  }
});

// Endpoint to increment the rep count
router.post("/increment-rep-count", async (req, res) => {
  try {
    const incrementBy = req.body.incrementBy || 1;
    const counter = await RepCounter.findOne();
    counter.repCount += incrementBy;
    await counter.save();
    res.json(counter);
  } catch (error) {
    res.status(500).json({ error: "Failed to increment rep count" });
  }
});

module.exports = router;
