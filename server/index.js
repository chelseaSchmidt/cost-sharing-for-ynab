const express = require('express');
const morgan = require('morgan');
const path = require('path');
require('../database/index.js');
const User = require('../database/model.js');

const app = express();
const port = process.env.PORT || 3003;
const publicDir = path.resolve(__dirname, '..', 'client', 'public');

app.use(morgan('dev'));
app.use(express.static(publicDir));

app.get('/:username', (req, res) => {
  User.find({ name: req.params.username })
    .then((result) => {
      res.status(200);
      res.send(result);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Good to go at port ${port}`);
});
