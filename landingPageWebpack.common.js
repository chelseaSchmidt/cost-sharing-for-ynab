const path = require('path');

module.exports = {
  entry: './client/landingPageSrc/index.jsx',
  output: {
    filename: 'landingPageBundle.js',
    path: path.resolve(__dirname, 'client', 'landingPage'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
