// server.js
const mongoose = require("mongoose");

require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Import routes
const gameRoutes = require("./routes/games");
const weatherRoutes = require("./routes/weather");
const injuryRoutes = require("./routes/injuries");
require("./jobs/injuryUpdateJob"); // Import the cron job

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB:", error));

// Middleware
app.use(express.json());

// Routes
app.use("/api/games", gameRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/injuries", injuryRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
