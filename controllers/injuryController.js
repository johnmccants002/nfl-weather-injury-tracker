const connectToDatabase = require("../db/conn"); // Import the database connection function

const getTeamInjuries = async (req, res) => {
  try {
    const { team } = req.params; // Get the team param from the request URL
    console.log("THIS IS THE TEAM", team);

    // Connect to the database
    const db = await connectToDatabase();
    const collection = db.collection("injuries");

    // Query MongoDB for injuries associated with the specified team
    const injuries = await collection.find({ teamName: team }).toArray();
    console.log("HERE ARE THE INJURIES: ", injuries);

    if (injuries.length === 0) {
      return res
        .status(404)
        .json({ message: `No injuries found for team: ${team}` });
    }

    res.json(injuries);
  } catch (error) {
    console.error("Error fetching team injuries:", error);
    res.status(500).json({ message: "Error fetching team injuries" });
  }
};

module.exports = { getTeamInjuries };
