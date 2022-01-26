/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const common = require('./landingPageWebpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
});
