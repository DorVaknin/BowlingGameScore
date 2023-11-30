
const Game = require('../models/gameModel');
const logger = require('../utils/helpers').log;
const startNewGame = async (playerName) => {
  logger(`Starting new game for: ${playerName}`);
  const frames = new Array(10).fill({ rolls: [], score: 0 });
  const newGame = new Game({ playerName, frames, currentScore: 0, completed: false });
  await newGame.save();
  return newGame;
};

module.exports = { startNewGame };
