const mongoose = require('mongoose');

const frameSchema = new mongoose.Schema({
  frameNumber: Number,
  rolls: [Number],
  score: Number
});

const gameSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  frames: [frameSchema],
  currentScore: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Game', gameSchema);
