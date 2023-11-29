const mongoose = require('mongoose');

const frameSchema = new mongoose.Schema({
  rolls: [Number],
  isTenthFrame: { type: Boolean, default: false }
});

const gameSchema = new mongoose.Schema({
    playerName: { type: String, required: true },
    frames: {
      type: [frameSchema],
      default: () => new Array(10).fill({ rolls: [], isTenthFrame: false })
    },
    currentScore: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
  });

module.exports = mongoose.model('Game', gameSchema);
