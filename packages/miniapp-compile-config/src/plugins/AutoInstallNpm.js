const { autoInstallNpm } = require('miniapp-builder-shared');
const { writeJSONSync } = require('fs-extra');
const { join } = require('path');
/**
 * Auto install npm
 */
module.exports = class AutoInstallNpmPlugin {
  constructor({ nativePackage = {} }) {
    this.autoInstall = nativePackage.autoInstall;
    this.dependencies = nativePackage.dependencies || null;
  }
  apply(compiler) {
    compiler.hooks.done.tapAsync('AutoInstallNpmPlugin', async(stats, callback) => {
      const distDir = stats.compilation.outputOptions.path;
      // Generate package.json
      if (this.dependencies) {
        const pkgFilePath = join(distDir, 'package.json');
        writeJSONSync(pkgFilePath, {
          dependencies: this.dependencies
        });
      }
      if (!this.autoInstall) {
        return callback();
      }
      await autoInstallNpm(distDir, callback);
    });
  }
};
