const express = require('express');
const { connect: connectDB } = require('./config/db');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
app.use(express.json());
connectDB();

app.use('/api/game', gameRoutes);

if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server is running on port ${port}`));
}

module.exports = app;