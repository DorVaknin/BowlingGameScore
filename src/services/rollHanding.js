
const Game = require('../models/gameModel');
const { updateFrames, calculateTotalScore, checkGameCompletion } = require('../utils/gameUtils');
const ErrorMappings = require('../utils/errorMappings');
const logger = require('../utils/helpers').log;

const recordRoll = async (gameId, pins) => {
  logger(`Handling roll for game: ${gameId}, pins: ${pins}`);
  let game = await Game.findById(gameId);
  if (!game) {
    throw new Error(ErrorMappings.Game_not_found);
  }
  if (game.completed) {
    throw new Error(ErrorMappings.Game_already_completed_No_more_rolls_can_be_recorded);
  }
  updateFrames(game, pins);
  game.currentScore = calculateTotalScore(game.frames);
  game.completed = checkGameCompletion(game);

  await game.save();

  return game;
};

module.exports = { recordRoll };
