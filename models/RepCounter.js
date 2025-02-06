const mongoose = require("mongoose");

const repCounterSchema = new mongoose.Schema({
  repCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("RepCounter", repCounterSchema);
