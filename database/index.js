const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sharedCostsForYNAB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => {
  console.log('Connected to sharedCostsForYNAB');
});

module.exports = db;
