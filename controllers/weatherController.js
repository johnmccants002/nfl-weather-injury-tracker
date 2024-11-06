// controllers/weatherController.js
const axios = require("axios");

const getWeather = async (req, res) => {
  const { gameId } = req.params;

  // Example to find location and time (will vary based on game data structure)
  const gameLocation = "San Francisco"; // Placeholder
  const gameTime = "2023-10-20T21:00:00Z"; // Placeholder

  try {
    const weatherApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${gameLocation}&date=${gameTime}`;
    const response = await axios.get(weatherApiUrl);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ message: "Error fetching weather data" });
  }
};

//testjiklj

module.exports = { getWeather };
