const express = require('express');
const https = require('https');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const usingHTTPS = !!process.env.HTTPS;
const port = process.env.PORT || 3003;
const publicDir = path.resolve(__dirname, '..', 'client', 'public');
const app = express();

app.use(morgan('dev'));
app.use(express.static(publicDir));

if (usingHTTPS) {
  const options = {
    key: fs.readFileSync(process.env.KEY) || '',
    cert: fs.readFileSync(process.env.CERT) || '',
  };
  https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS good to go at port ${port}`);
  });
} else {
  app.listen(port, () => console.log(`HTTP good to go at port ${port}`));
}
