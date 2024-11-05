// controllers/gameController.js
const axios = require("axios");
const CurrentWeek = require("../models/CurrentWeek");

const getCurrentWeekSchedule = async (req, res) => {
  try {
    const apiUrl = `https://api.sportradar.com/nfl/official/trial/v7/en/games/current_week/schedule.json?api_key=${process.env.NFL_API_KEY}`;
    const response = await axios.get(apiUrl);

    const weekData = response.data.week;
    const { sequence, title } = weekData;
    const { year, type } = response.data;

    // Save or update the current week in MongoDB
    await CurrentWeek.findOneAndUpdate(
      {},
      { sequence, title, year, type },
      { upsert: true, new: true }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching current week schedule:", error);
    res.status(500).json({ message: "Error fetching current week schedule" });
  }
};

const getNextWeekSchedule = async (req, res) => {
  try {
    // Retrieve the current week from MongoDB
    const currentWeekData = await CurrentWeek.findOne();
    if (!currentWeekData || !currentWeekData.sequence) {
      return res.status(404).json({ message: "Current week data not found" });
    }

    const nextWeekNumber = currentWeekData.sequence + 1;

    // Define API parameters for the next week
    const locale = "en";
    const year = currentWeekData.year;
    const seasonType = currentWeekData.type;

    // Construct the API URL for next week's schedule
    const apiUrl = `https://api.sportradar.com/nfl/official/trial/v7/${locale}/games/${year}/${seasonType}/${nextWeekNumber}/schedule.json?api_key=${process.env.NFL_API_KEY}`;

    // Fetch the next week's schedule from Sportradar
    const response = await axios.get(apiUrl);

    // Return the data for the next week
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching next week schedule:", error);
    res.status(500).json({ message: "Error fetching next week schedule" });
  }
};

module.exports = { getCurrentWeekSchedule, getNextWeekSchedule };