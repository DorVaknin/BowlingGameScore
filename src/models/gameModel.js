const mongoose = require('mongoose');
const logger = require('../utils/helpers').log;

const frameSchema = new mongoose.Schema({
  rolls: [Number],
  frameScore: { type: Number, default: 0 }
});

const gameSchema = new mongoose.Schema({
    playerName: { type: String, required: true },
    frames: {
      type: [frameSchema],
      default: () => new Array(10).fill({ rolls: [] })
    },
    currentScore: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
  });

  gameSchema.pre('save', function() {
    logger(`Saving game: ${this._id}`);
});

module.exports = mongoose.model('Game', gameSchema);
