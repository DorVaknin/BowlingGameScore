
const Game = require('../models/gameModel');

const startNewGame = async (playerName) => {
  const frames = new Array(10).fill({ rolls: [], score: 0 });
  const newGame = new Game({ playerName, frames, currentScore: 0, completed: false });
  await newGame.save();
  return newGame;
};

module.exports = { startNewGame };
