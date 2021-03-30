const { autoInstallNpm } = require('miniapp-builder-shared');
const { writeJSONSync } = require('fs-extra');
const { join } = require('path');
/**
 * Auto install npm
 */
module.exports = class AutoInstallNpmPlugin {
  constructor({ nativePackage = {} }) {
    this.autoInstall = nativePackage.autoInstall;
    this.dependencies = nativePackage.dependencies || {};
  }
  apply(compiler) {
    compiler.hooks.done.tapAsync('AutoInstallNpmPlugin', async(stats, callback) => {
      if (!this.autoInstall) {
        return callback();
      }
      // Generate package.json
      const distDir = stats.compilation.outputOptions.path;
      const pkgFilePath = join(distDir, 'package.json');
      writeJSONSync(pkgFilePath, {
        dependencies: this.dependencies
      });
      await autoInstallNpm(distDir, callback);
    });
  }
};
