const { MongoClient } = require("mongodb");

const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);

let db;

async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db("weatherinjurytracker");
      console.log("Connected to MongoDB");
    } catch (e) {
      console.error("Error connecting to MongoDB:", e);
      throw e;
    }
  }
  return db;
}

module.exports = connectToDatabase;
