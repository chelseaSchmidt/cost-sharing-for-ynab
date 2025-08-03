#!/usr/bin/env node
import express from 'express';
import morgan from 'morgan';
import path from 'path';

const server = express();

server.use(morgan('dev'));
server.use(express.static(path.resolve(__dirname, '..', 'client', 'landingPage', 'public')));
server.use(
  '/cost-sharer',
  express.static(path.resolve(__dirname, '..', 'client', 'app', 'public')),
);

const port = process.env['PORT'] || 3000;

server.listen(port, () => {
  console.log(`Listening at ${port}`);
});
