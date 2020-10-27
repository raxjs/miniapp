const { compilation } = require('webpack');

module.exports = class RemoveDefaultResultPlugin {
  apply(compiler) {
    compiler.hooks.afterCompile.tapAsync('RemoveDefaultResultPlugin', (compilation, callback) => {
      compilation.assets = {};
      callback();
    });
  }
};
