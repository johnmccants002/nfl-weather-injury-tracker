// routes/weather.js
const express = require("express");
const router = express.Router();
const { getWeather } = require("../controllers/weatherController");

router.get("/:gameId", getWeather);

module.exports = router;
