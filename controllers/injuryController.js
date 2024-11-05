const Injury = require("../models/Injury"); // Make sure this path is correct for your Injury model

const getTeamInjuries = async (req, res) => {
  try {
    const { team } = req.params; // Get the team param from the request URL
    console.log("THIS IS THE TEAM", team);

    // Query MongoDB for injuries associated with the specified team
    const injuries = await Injury.find({ teamName: team }); // Adjust this path if needed based on your schema
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
