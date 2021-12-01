import { extname } from 'path';
import { minify } from './minifyCode';

// Add file to compilation
export default function(compilation, { filename, content, command = 'build', target }) {
  compilation.assets[`${filename}`] = {
    source: () => command === 'build' ? minify(content, extname(filename), target) : content,
    size: () => Buffer.from(content).length
  };
};
