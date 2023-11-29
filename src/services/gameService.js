const Game = require('../models/gameModel');

const startNewGame = async (playerName) => {
  const frames = new Array(10).fill({ rolls: [], score: 0 });
  const newGame = new Game({ playerName, frames, currentScore: 0, completed: false });
  await newGame.save();
  return newGame;
};

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
  game.currentScore = calculateTotalScore(game);
  game.completed = checkGameCompletion(game);

  try {
    await game.save();
} catch (error) {
    console.error('Error saving game:', error);
}
  return game;
};

const updateCurrentFrame = (game, pins) => {
  let frameIndex = game.frames.findIndex(frame => frame.rolls.length < 2 || frame.isTenthFrame);
  let frame = game.frames[frameIndex];

  frame.rolls.push(pins);

  // Special handling for the tenth frame
  handleTenthFrame(frameIndex, frame);
};

const handleTenthFrame = (frameIndex, frame) => {
    if (isTenthFrame(frameIndex)) {
        if (isStrikeOnFirstRollOfLastFrame(frameIndex, frame)) {
          // Allow two more rolls if the first roll is a strike //TODO
          frame.isTenthFrame = true;
        } else if (isSpareOnFirstTwoRollsOfLastFrame(frame, pins)) {
          // Allow one more roll if there is a spare //TODO
          frame.isTenthFrame = true;
        }
      }
}

const isSpareOnFirstTwoRollsOfLastFrame = (frame, pins) => {
    return frame.rolls.length === 2 && isSpare(frame.rolls);
}

const isStrikeOnFirstRollOfLastFrame = (frame, pins) => {
    return frame.rolls.length === 1 && isStrike(pins);
}

const isStrike = (pins) => {
    return pins === 10;
}

const isSpare = (rolls) => {
    return rolls[0] + rolls[1] >= 10;
}


const isTenthFrame = (frameIndex) => {
    return frameIndex === 9;
}

const calculateTotalScore = (game) => {
  let totalScore = 0;
  game.frames.forEach((frame, index) => {
    let frameScore = 0;
    if (isStrike(frame.rolls[0])) {
      frameScore += 10 + getNextTwoRollsScore(game, index);
    } else if (isSpare(frame.rolls)) {
      frameScore += 10 + (game.frames[index + 1]?.rolls[0] || 0);
    } else {
      frameScore += frame.rolls.reduce((a, b) => a + b, 0);
    }
    totalScore += frameScore;
  });
  return totalScore;
};

const getNextTwoRollsScore = (game, frameIndex) => {
    const nextFrame = game.frames[frameIndex + 1];
    const frameAfterNext = game.frames[frameIndex + 2];

    if (nextFrame && nextFrame.rolls[0] === 10) {
        // Next frame is a strike
        return nextFrameStrike(frameIndex, nextFrame, frameAfterNext);
    } else if (nextFrame) {
        // Next frame is not a strike
        return nextFrameNotStrike(nextFrame);
    }
    
    // No next frame or incomplete next frame
    return 0;
};

const nextFrameNotStrike = (nextFrame) => {
    if (nextFrame && nextFrame.rolls.length > 1) {
        return nextFrame.rolls[0] + nextFrame.rolls[1];
    }
    return 0; // If the next frame doesn't have two rolls
};


const nextFrameStrike = (frameIndex, nextFrame, frameAfterNext) => {
    if (frameIndex === 8) { // Special case for the 9th frame
        return nextFrame.rolls[0] + (nextFrame.rolls[1] || 0);
    } else { // General case for frames before the 9th
        return nextFrame.rolls[0] + (frameAfterNext?.rolls[0] || 0);
    }
};


const checkGameCompletion = (game) => {
  const lastFrame = game.frames[9];
  return lastFrame.rolls.length === 3 || (lastFrame.rolls.length === 2 && lastFrame.rolls[0] !== 10 && lastFrame.rolls[0] + lastFrame.rolls[1] !== 10);
};

module.exports = { startNewGame, recordRoll };
