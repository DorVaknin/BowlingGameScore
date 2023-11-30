const ErrorMappings = require('../utils/errorMappings');
const MAX_PINS_IN_A_FRAME = 10
const LAST_FRAME_INDEX = 9;

const updateFrames = (game, pins) => {
  const frameIndex = findCurrentFrameIndex(game);
  validateRoll(game, frameIndex, pins);
  const frame = game.frames[frameIndex];
  frame.rolls.push(pins);
  calculateFramesScore(frame, game.frames);
};

const findCurrentFrameIndex = (game) => {
  return game.frames.findIndex((frame, index) => {
    if (isEarlyFrame(index)) {
      return (hasNoRolls(frame) || hasOneRoll(frame)) && !isStrike(frame);
    }

    if (isTenthFrame(index)) {
      return hasNoRolls(frame) || hasOneRoll(frame) || (hasTwoRolls(frame) && (isStrike(frame) || isSpare(frame)));
    }

    return false; //unreachable
  });
};

const calculateFramesScore = (frame, frames) => {
  frame.frameScore = sumOfRolls(frame.rolls);
  updatePreviousFrameScores(frames);
};

const updatePreviousFrameScores = (frames) => {
  for (let i = 0; i < frames.length - 1; i++) {
    let frame = frames[i];
    if (isStrike(frame) || isSpare(frame)) {
      let additionalRollsNeeded = isStrike(frame) ? 2 : 1;
      let additionalScore = scoreOfNextRolls(frames, i, additionalRollsNeeded);
      frame.frameScore = MAX_PINS_IN_A_FRAME + additionalScore;
    }
  }
};

const scoreOfNextRolls = (frames, frameIndex, rollsCount) => {
  let score = 0, rollsFound = 0;
  for (let i = frameIndex + 1; i < frames.length && rollsFound < rollsCount; i++) {
    for (const roll of frames[i].rolls) {
      if (rollsFound < rollsCount) {
        score += roll;
        rollsFound++;
      }
    }
  }
  return score;
};

const isStrike = (frame) => frame.rolls[0] === MAX_PINS_IN_A_FRAME;
const isSpare = (frame) => hasTwoRolls(frame) && sumOfRolls(frame.rolls) === MAX_PINS_IN_A_FRAME;
const sumOfRolls = (rolls) => rolls.reduce((sum, pins) => sum + pins, 0);
const isEarlyFrame = (index) => index < LAST_FRAME_INDEX;
const isTenthFrame = (index) => index === LAST_FRAME_INDEX;
const hasNoRolls = (frame) => frame.rolls.length === 0;
const hasOneRoll = (frame) => frame.rolls.length === 1;
const hasTwoRolls = (frame) => frame.rolls.length === 2;

const calculateTotalScore = (frames) => frames.reduce((total, frame) => total + frame.frameScore, 0);

const checkGameCompletion = (game) => {
  const lastFrame = game.frames[LAST_FRAME_INDEX];
  return isCompleteFrame(lastFrame);
};

const isCompleteFrame = (frame) => {
  if (isStrike(frame) || isSpare(frame)) return frame.rolls.length === 3;
  return frame.rolls.length === 2;
};

const validateRoll = (game, frameIndex, pins) => {
  const frame = game.frames[frameIndex];

  if (isEarlyFrame(frameIndex)) {
    validateEarlyFrame(frame, pins);
  } else {
    validateTenthFrame(frame, pins);
  }
};

const validateEarlyFrame = (frame, pins) => {
  const frameTotal = frame.rolls.reduce((sum, roll) => sum + roll, 0);
  if (frameTotal + pins > MAX_PINS_IN_A_FRAME) {
    throw new Error(ErrorMappings.Exceeds_frame_limit);
  }
};

const validateTenthFrame = (frame, pins) => {
  if (frame.rolls.length === 0 && pins > MAX_PINS_IN_A_FRAME) {
    throw new Error(ErrorMappings.Exceeds_single_roll_limit);
  } else if (frame.rolls.length === 1 && !isStrike(frame) && frame.rolls[0] + pins > MAX_PINS_IN_A_FRAME) {
    throw new Error(ErrorMappings.Exceeds_frame_roll_limit);
  } else if (frame.rolls.length === 2 && (isStrike(frame) || isSpare(frame)) && pins > MAX_PINS_IN_A_FRAME) {
    throw new Error(ErrorMappings.Exceeds_bonus_roll_limit);
  }
};


module.exports = { updateFrames, calculateTotalScore, checkGameCompletion };
