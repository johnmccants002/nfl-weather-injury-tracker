const mongoose = require("mongoose");

const injurySchema = new mongoose.Schema({
  teamId: String,
  teamName: String,
  players: [
    {
      playerId: String,
      name: String,
      jersey: String,
      position: String,
      injuries: [
        {
          status: String,
          status_date: String,
          practice: {
            status: String,
          },
          primary: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Injury", injurySchema);
