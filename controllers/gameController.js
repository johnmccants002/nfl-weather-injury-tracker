const connectToDatabase = require("../db/conn"); // Import the database connection function

const getCurrentWeekSchedule = async (req, res) => {
  try {
    const apiUrl = `https://api.sportradar.com/nfl/official/trial/v7/en/games/current_week/schedule.json?api_key=${process.env.NFL_API_KEY}`;
    const response = await fetch(apiUrl);
    const data = await response.json(); // Parse JSON response

    // Check if week data exists
    const weekData = data.week;
    if (!weekData) {
      console.error("Week data not found in response");
      return res.status(500).json({ message: "Week data not found" });
    }

    const { sequence, title } = weekData;
    const { year, type } = data;

    // Get the db connection
    const db = await connectToDatabase();
    const collection = db.collection("currentweeks");

    await collection.updateOne(
      {}, // Update the first document it finds
      { $set: { sequence, title, year, type } },
      { upsert: true } // Create the document if it doesn't exist
    );

    res.json(data);
  } catch (error) {
    console.error("Error fetching current week schedule:", error);
    res.status(500).json({ message: "Error fetching current week schedule" });
  }
};

const getNextWeekSchedule = async (req, res) => {
  try {
    // Get the db connection
    const db = await connectToDatabase();
    const collection = db.collection("currentweeks");
    const currentWeekData = await collection.findOne({});

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
    const response = await fetch(apiUrl);
    const nextWeekData = await response.json();

    // Return the data for the next week
    res.json(nextWeekData);
  } catch (error) {
    console.error("Error fetching next week schedule:", error);
    res.status(500).json({ message: "Error fetching next week schedule" });
  }
};

module.exports = { getCurrentWeekSchedule, getNextWeekSchedule };
