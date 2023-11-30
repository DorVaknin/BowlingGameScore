const MAX_PINS_IN_A_FRAME = 10
const LAST_FRAME_INDEX = 9;
const updateCurrentFrame = (game, pins) => {
  const frameIndex = findCurrentFrameIndex(game);
  validateRoll(game, frameIndex, pins);
  const frame = game.frames[frameIndex];
  frame.rolls.push(pins);
  frame.frameScore = calculateFrameScore(frame, game.frames, frameIndex);
};

const findCurrentFrameIndex = (game) => {
  return game.frames.findIndex((frame, index) => {
    if (isEarlyFrame(index)) {
      return hasNoRolls(frame) || hasOneRoll(frame);
    }

    if (isTenthFrame(index)) {
      return hasNoRolls(frame) || hasOneRoll(frame) || (hasTwoRolls(frame) && (isStrike(frame) || isSpare(frame)));
      // Tenth frame is incomplete with one roll, or two rolls if one is a strike or they add up to a spare
    }

    return false; // (should not be reached)
  });
};

const calculateFrameScore = (frame, frames, frameIndex) => {
  if (isStrike(frame)) {
    return 10 + scoreOfNextRolls(frames, frameIndex, 2);
  } else if (isSpare(frame)) {
    return 10 + scoreOfNextRolls(frames, frameIndex, 1);
  }
  return sumOfRolls(frame.rolls);
};

const isStrike = (frame) => frame.rolls[0] === MAX_PINS_IN_A_FRAME;
const isSpare = (frame) => hasTwoRolls(frame) && sumOfRolls(frame.rolls) === MAX_PINS_IN_A_FRAME;
const sumOfRolls = (rolls) => rolls.reduce((sum, pins) => sum + pins, 0);
const isEarlyFrame = (index) => index < LAST_FRAME_INDEX;
const isTenthFrame = (index) => index === LAST_FRAME_INDEX;
const hasNoRolls = (frame) => frame.rolls.length === 0;
const hasOneRoll = (frame) => frame.rolls.length === 1;
const hasTwoRolls = (frame) => frame.rolls.length === 2;

const scoreOfNextRolls = (frames, frameIndex, rollsCount) => {
  let score = 0, rollsFound = 0;
  for (let i = frameIndex + 1; i < frames.length && rollsFound < rollsCount; i++) {
    frames[i].rolls.forEach(roll => {
      if (rollsFound < rollsCount) {
        score += roll;
        rollsFound++;
      }
    });
  }
  return score;
};

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
    throw new Error('Invalid roll: total pins in a frame cannot exceed 10.');
  }
};

const validateTenthFrame = (frame, pins) => {
  if (frame.rolls.length === 0 && pins > MAX_PINS_IN_A_FRAME) {
    throw new Error('Invalid roll: cannot knock down more than 10 pins in a single roll.');
  } else if (frame.rolls.length === 1 && !isStrike(frame) && frame.rolls[0] + pins > MAX_PINS_IN_A_FRAME) {
    throw new Error(`Invalid roll: total pins in two rolls of a frame cannot exceed ${ MAX_PINS_IN_A_FRAME }.`);
  } else if (frame.rolls.length === 2 && (isStrike(frame) || isSpare(frame)) && pins > MAX_PINS_IN_A_FRAME) {
    throw new Error('Invalid roll: cannot knock down more than 10 pins in a bonus roll.');
  }
};


module.exports = { updateCurrentFrame, calculateTotalScore, checkGameCompletion };
