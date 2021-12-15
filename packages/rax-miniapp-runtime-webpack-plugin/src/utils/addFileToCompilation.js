const { extname } = require('path');
const { emitAsset } = require('@builder/compat-webpack4');
const webpackSources = require('webpack-sources');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const { minify } = require('./minifyCode');

// Add file to compilation
module.exports = function(compilation, { filename, content, target, needMinify = true }) {
  const { RawSource } = webpack.sources || webpackSources;
  const shouldMinify = needMinify && compilation.options.optimization.minimize;
  const rawSource = new RawSource(shouldMinify ? minify(content, extname(filename), target) : content);
  emitAsset(compilation, filename, rawSource);
};
