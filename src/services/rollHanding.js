
const Game = require('../models/gameModel');
const { updateCurrentFrame, calculateTotalScore, checkGameCompletion } = require('../utils/gameUtils');

const recordRoll = async (gameId, pins) => {
  let game = await Game.findById(gameId);
  if (!game) {
    throw new Error('Game not found');
  }

  // Check if the game is already completed
  if (game.completed) {
    throw new Error('Game already completed. No more rolls can be recorded.');
  }
  updateCurrentFrame(game, pins);
  game.currentScore = calculateTotalScore(game.frames);
  game.completed = checkGameCompletion(game);

    await game.save();

  return game;
};

module.exports = { recordRoll };
