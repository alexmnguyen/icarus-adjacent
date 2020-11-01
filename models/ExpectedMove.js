const mongoose = require("mongoose");

const expectedMoveSchema = new mongoose.Schema({
  date: String,
  em: Number,
});

const ExpectedMove = mongoose.model("ExpectedMove", expectedMoveSchema);

module.exports = ExpectedMove;
