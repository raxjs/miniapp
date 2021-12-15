import { extname } from 'path';
import { emitAsset } from '@builder/compat-webpack4';
import * as webpackSources from 'webpack-sources';
import * as webpack from 'webpack';

import { minify } from './minifyCode';

// Add file to compilation
export default function(compilation, { filename, content, command = 'build', target }) {
  const { RawSource } = webpack.sources || webpackSources;
  const shouldMinify = command = 'build' && compilation.options.optimization.minimize;
  const rawSource = new RawSource(shouldMinify ? minify(content, extname(filename), target) : content);
  emitAsset(compilation, filename, rawSource);
};
