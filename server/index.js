#!/usr/bin/env node
const express = require('express');
const https = require('https');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

// set up main server
const costSharingForYnabServer = express();
costSharingForYnabServer.use(morgan('dev'));

costSharingForYnabServer.use(
  express.static(path.resolve(__dirname, '..', 'client', 'site')),
);
costSharingForYnabServer.use(
  '/cost-sharer',
  express.static(path.resolve(__dirname, '..', 'client', 'app')),
);

// set up server to redirect HTTP requests to equivalent HTTPS url
const redirectServer = express();
redirectServer.use(morgan('dev'));

redirectServer.get('*', (req, res) => {
  console.log('Request redirected to HTTPS server');
  res.redirect(`https://${req.headers.host}${req.url}`);
});

// start server(s)
const httpsPort = process.env.HTTPSPORT || 3001;
const httpPort = process.env.HTTPPORT || 3000;

if (process.env.IS_HTTPS) {
  const options = {
    key: fs.readFileSync(path.resolve(__dirname, process.env.KEY)),
    cert: fs.readFileSync(path.resolve(__dirname, process.env.CERT)),
  };

  https
    .createServer(options, costSharingForYnabServer)
    .listen(httpsPort, () => {
      console.log(`Listening for HTTPS requests at ${httpsPort}`);
    });

  redirectServer.listen(httpPort, () => {
    console.log(`Listening for HTTP requests at ${httpPort} to forward to HTTPS server at ${httpsPort}`);
  });
} else {
  costSharingForYnabServer.listen(httpPort, () => {
    console.log(`Listening for HTTP requests at ${httpPort}`);
  });
}
