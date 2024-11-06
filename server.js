// server.js
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Import routes
const gameRoutes = require("./routes/games");
const weatherRoutes = require("./routes/weather");
const injuryRoutes = require("./routes/injuries");
require("./jobs/injuryUpdateJob"); // Import the cron job

// MongoDB connection URI
const uri =
  process.env.MONGO_CONNECTION_STRING ||
  "mongodb+srv://johnmccants002:<db_password>@nflweatherinjurytracker.r88hk.mongodb.net/?retryWrites=true&w=majority&appName=nflweatherinjurytracker";

// Create a MongoClient with Stable API version options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Function to check MongoDB connection
async function runMongoClient() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoClient connection error:", error);
  } finally {
    await client.close();
  }
}
runMongoClient().catch(console.dir);

// Connect to MongoDB using Mongoose
mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB using Mongoose"))
  .catch((error) =>
    console.error("Could not connect to MongoDB with Mongoose:", error)
  );

// Middleware
app.use(express.json());

// Routes
app.use("/api/games", gameRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/injuries", injuryRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
