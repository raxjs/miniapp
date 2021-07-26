const { autoInstallNpm } = require('miniapp-builder-shared');
const { writeJSONSync } = require('fs-extra');
const { join, dirname } = require('path');
/**
 * Auto install npm
 */
module.exports = class AutoInstallNpmPlugin {
  constructor({ nativePackage = {} }) {
    this.autoInstall = nativePackage.autoInstall;
    this.dependencies = nativePackage.dependencies || null;
    this.subPackages = nativePackage.subPackages || null;
  }
  apply(compiler) {
    compiler.hooks.done.tapAsync('AutoInstallNpmPlugin', async(stats, callback) => {
      const packageJsonFilePath = [];
      const distDir = stats.compilation.outputOptions.path;
      // Generate package.json
      if (this.dependencies) {
        writeJSONSync(join(distDir, 'package.json'), { dependencies: this.dependencies });
        packageJsonFilePath.push('');
      }
      if (this.subPackages) {
        this.subPackages.forEach(({ dependencies = {}, source = '' }) => {
          writeJSONSync(join(distDir, dirname(source), 'package.json'), { dependencies });
          packageJsonFilePath.push(dirname(source));
        })
      }

      if (!this.autoInstall) {
        return callback();
      }
      await autoInstallNpm(callback, { distDir, packageJsonFilePath });
    });
  }
};
