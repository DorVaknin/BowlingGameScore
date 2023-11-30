const gameInitialization = require('../services/gameInitialization');
const rollHandling = require('../services/rollHanding');
const logger = require('../utils/helpers').log;
exports.startNewGame = async (req, res) => {
  logger(`Starting startNewGame with params: ${JSON.stringify(req.body)}`);
    try {
      const newGame = await gameInitialization.startNewGame(req.body.playerName);
      res.status(201).json(newGame);
    } catch (err) {
      res.status(500).send(err.message);
    }
    logger('Ending startNewGame');
  };

exports.recordRoll = async (req, res) => {
logger(`Starting recordRoll with params: ${JSON.stringify(req.body)}`);
try {
    const { gameId, pins } = req.body;
    const updatedGame = await rollHandling.recordRoll(gameId, pins);
    res.json(updatedGame);
} catch (err) {
    res.status(500).send(err.message);
}
logger('Ending recordRoll');
};