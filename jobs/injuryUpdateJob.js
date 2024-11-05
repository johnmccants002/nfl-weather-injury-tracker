const cron = require("node-cron");
const axios = require("axios");
const mongoose = require("mongoose");
const CurrentWeek = require("../models/CurrentWeek"); // Import the model for the current week

cron.schedule(
  "0 9 * * *",
  async () => {
    try {
      console.log("Running daily injury update");

      // Fetch the current week from MongoDB
      const currentWeek = await CurrentWeek.findOne({});
      if (!currentWeek) {
        throw new Error("Current week not found in the database");
      }

      // Define the API parameters
      const locale = "en";
      const year = 2024; // You could dynamically set this to the current year if needed
      const seasonType = "REG";
      const weekNumber = currentWeek.sequence; // Use the current week number from MongoDB

      // Construct the URL with query parameters
      const url = `http://localhost:3000/api/injuries?locale=${locale}&year=${year}&season_type=${seasonType}&week_number=${weekNumber}`;

      // Make the request to update injury data
      await axios.get(url);
      console.log("Injury data fetched and saved successfully");
    } catch (error) {
      console.error("Error fetching injury data:", error);
    }
  },
  {
    timezone: "America/Los_Angeles",
  }
);
