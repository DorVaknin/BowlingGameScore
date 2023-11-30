const mongoose = require('mongoose');
const { log } = require('../utils/helpers')
const CONNECTION_STRING = 'mongodb+srv://dorvaknin:6WYWBhNDY06ZrdKr@bowlingscorecluster.5amsl3d.mongodb.net/BowlingScoresDB';
const connect = async () => {
  try {
    await mongoose.connect(getConnectionString());
    log('Connected to MongoDB...');
  } catch (err) {
    console.error('Could not connect to MongoDB...', err);
    process.exit(1);
  }
};

const getConnectionString = () => {
  let connectionString;
  if (process.env.NODE_ENV === 'test') {
    connectionString = process.env.TEST_MONGODB_URI;
  } else {
    connectionString = CONNECTION_STRING;
  }

  return connectionString;
}

module.exports = { connect };