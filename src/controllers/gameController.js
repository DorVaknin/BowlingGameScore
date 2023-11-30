const gameInitialization = require('../services/gameInitialization');
const rollHandling = require('../services/rollHanding');

exports.startNewGame = async (req, res) => {
    try {
      const newGame = await gameInitialization.startNewGame(req.body.playerName);
      res.status(201).json(newGame);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

exports.recordRoll = async (req, res) => {
try {
    const { gameId, pins } = req.body;
    const updatedGame = await rollHandling.recordRoll(gameId, pins);
    res.json(updatedGame);
} catch (err) {
    res.status(500).send(err.message);
}
};