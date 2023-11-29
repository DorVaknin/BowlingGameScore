const express = require('express');
const mongoose = require('mongoose');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://dorvaknin:6WYWBhNDY06ZrdKr@bowlingscorecluster.5amsl3d.mongodb.net/BowlingScoresDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB...');
  } catch (err) {
    console.error('Could not connect to MongoDB...', err);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

app.use('/api/game', gameRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
