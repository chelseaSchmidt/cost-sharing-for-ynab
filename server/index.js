#!/usr/bin/env node
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const server = express();

server.use(morgan('dev'));
server.use(express.static(path.resolve(__dirname, '..', 'client', 'landingPage')));
server.use('/cost-sharer', express.static(path.resolve(__dirname, '..', 'client', 'app')));

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Listening at ${port}`);
});
