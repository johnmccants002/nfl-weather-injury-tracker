// routes/games.js
const express = require("express");
const router = express.Router();
const {
  getCurrentWeekSchedule,
  getNextWeekSchedule,
} = require("../controllers/gameController");

router.get("/current-week", getCurrentWeekSchedule);
router.get("/next-week", getNextWeekSchedule);

module.exports = router;
