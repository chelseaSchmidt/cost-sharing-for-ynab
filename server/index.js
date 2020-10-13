const express = require('express');
const https = require('https');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const usingHTTPS = !!process.env.HTTPS;
const httpsPort = process.env.HTTPSPORT || 443;
const httpPort = process.env.HTTPPORT || 80;
const publicDir = path.resolve(__dirname, '..', 'client', 'public');
const app = express();
const redirectApp = express();

app.use(morgan('dev'));
app.use(express.static(publicDir));

redirectApp.use(morgan('dev'));
redirectApp.get('*', (req, res) => {
  console.log('redirected to HTTPS');
  res.redirect(`https://${req.headers.host}${req.url}`);
});

if (usingHTTPS) {
  const options = {
    key: fs.readFileSync(process.env.KEY) || '',
    cert: fs.readFileSync(process.env.CERT) || '',
  };
  https.createServer(options, app).listen(httpsPort, () => {
    console.log(`HTTPS good to go at port ${httpsPort}`);
  });
  redirectApp.listen(httpPort, () => console.log(`HTTP at ${httpPort} forwarding to HTTPS at ${httpsPort}`));
} else {
  app.listen(httpPort, () => console.log(`HTTP good to go at port ${httpPort}`));
}
