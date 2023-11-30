const updateCurrentFrame = (game, pins) => {
  const frameIndex = findCurrentFrameIndex(game);
  const frame = game.frames[frameIndex];
  frame.rolls.push(pins);
  frame.frameScore = calculateFrameScore(frame, game.frames, frameIndex);
};

const findCurrentFrameIndex = (game) => {
  return game.frames.findIndex((frame, index) => {
    const isEarlyFrame = index < 9;
    const isTenthFrame = index === 9;
    const hasNoRolls = frame.rolls.length === 0;
    const hasOneRoll = frame.rolls.length === 1;
    const hasTwoRolls = frame.rolls.length === 2;
    const isStrike = frame.rolls[0] === 10;
    const isSpare = hasTwoRolls && (frame.rolls[0] + frame.rolls[1] === 10);

    if (isEarlyFrame) {
      return hasNoRolls || hasOneRoll; // Early frames are incomplete with only one roll
    }

    if (isTenthFrame) {
      return hasNoRolls || hasOneRoll || (hasTwoRolls && (isStrike || isSpare));
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

const isStrike = (frame) => frame.rolls[0] === 10;
const hasTwoRolls = (frame) => frame.rolls.length === 2;
const isSpare = (frame) => hasTwoRolls(frame) && sumOfRolls(frame.rolls) === 10;
const sumOfRolls = (rolls) => rolls.reduce((sum, pins) => sum + pins, 0);

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
  const lastFrame = game.frames[9];
  return isCompleteFrame(lastFrame);
};

const isCompleteFrame = (frame) => {
  if (isStrike(frame) || isSpare(frame)) return frame.rolls.length === 3;
  return frame.rolls.length === 2;
};

module.exports = { updateCurrentFrame, calculateTotalScore, checkGameCompletion };
