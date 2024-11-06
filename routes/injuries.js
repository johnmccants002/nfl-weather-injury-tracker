const express = require("express");
const axios = require("axios");
const router = express.Router();
const { getTeamInjuries } = require("../controllers/injuryController");
const connectToDatabase = require("../db/conn"); // Import the database connection function

router.get("/", async (req, res) => {
  const { locale, year, season_type, week_number } = req.query;

  const api_key = process.env.NFL_API_KEY; // Add this to your .env file
  const apiUrl = `https://api.sportradar.com/nfl/official/trial/v7/${locale}/seasons/${year}/${season_type}/${week_number}/injuries.json?api_key=${api_key}`;

  try {
    const response = await axios.get(apiUrl);
    const injuryData = response.data;

    // Get the db connection
    const db = await connectToDatabase();
    const collection = db.collection("injuries");

    // Clear previous data (optional) and insert new injury data
    await collection.deleteMany({}); // Optional: clear previous data for a fresh insert
    await collection.insertMany(
      injuryData.teams.map((team) => ({
        teamId: team.id,
        teamName: team.name,
        players: team.players.map((player) => ({
          playerId: player.id,
          name: player.name,
          jersey: player.jersey,
          position: player.position,
          injuries: player.injuries,
        })),
      }))
    );

    res.status(200).json({ message: "Injury data saved successfully" });
  } catch (error) {
    console.error("Error fetching injuries:", error);
    res.status(500).json({ error: "Could not fetch injuries" });
  }
});

router.get("/:team", getTeamInjuries);

module.exports = router;
