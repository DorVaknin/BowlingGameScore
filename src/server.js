const express = require('express');
const { connect: connectDB } = require('./config/db');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
app.use(express.json());
connectDB();

app.use('/api/game', gameRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
