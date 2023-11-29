const Game = require('../models/gameModel');

exports.startNewGame = async (req, res) => {
  try {
    const frames = new Array(10).fill({ rolls: [], score: 0 });

    const newGame = new Game({
      playerName: req.body.playerName,
      frames: frames,
      currentScore: 0,
      completed: false
    });

    await newGame.save();

    res.status(201).json({
      message: 'New game started successfully',
      gameId: newGame._id,
      data: newGame
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};


exports.recordRoll = async (req, res) => {
  try {
    res.json({ message: 'Roll recorded' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
