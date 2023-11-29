exports.getGameStatus = async (req, res) => {
    try {
      res.send('Game  endpoint hit');
    } catch (err) {
      res.status(500).send(err.message);
    }
  };