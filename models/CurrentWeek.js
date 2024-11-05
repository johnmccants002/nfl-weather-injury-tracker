const mongoose = require("mongoose");

const currentWeekSchema = new mongoose.Schema({
  sequence: { type: Number, required: true },
  title: { type: String },
  year: { type: Number },
  type: { type: String },
});

module.exports = mongoose.model("CurrentWeek", currentWeekSchema);
