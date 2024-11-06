const cron = require("node-cron");
const axios = require("axios");
const connectToDatabase = require("../db/conn"); // Import the database connection function

cron.schedule(
  "0 9 * * *",
  async () => {
    try {
      console.log("Running daily injury update");

      // Connect to the database and fetch the current week
      const db = await connectToDatabase();
      const currentWeek = await db.collection("currentWeek").findOne({});

      if (!currentWeek) {
        throw new Error("Current week not found in the database");
      }

      // Define the API parameters
      const locale = "en";
      const year = 2024; // Optionally, dynamically set this to the current year if needed
      const seasonType = "REG";
      const weekNumber = currentWeek.sequence; // Use the current week number from MongoDB

      // Construct the URL with query parameters
      const url = `https://nfl-weather-injury-tracker-48b3c17d4980.herokuapp.com/injuries?locale=${locale}&year=${year}&season_type=${seasonType}&week_number=${weekNumber}`;

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
