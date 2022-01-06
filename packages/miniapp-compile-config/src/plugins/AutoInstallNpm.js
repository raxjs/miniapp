const { autoInstallNpm } = require('miniapp-builder-shared');
const { writeJSONSync, existsSync, readJSONSync } = require('fs-extra');
const { join, dirname } = require('path');

function isObjectValueEqual(left, right) {
  var leftProps = Object.getOwnPropertyNames(left);
  var rightProps = Object.getOwnPropertyNames(right);

  if (leftProps.length !== rightProps.length) {
    return false;
  }

  for (var i = 0; i < leftProps.length; i++) {
    var propName = leftProps[i];
    var propLeft = left[propName];
    var propRight = right[propName];
    if (propLeft !== propRight) {
      return false;
    }
  }
  return true;
}

function shouldWritePackageJson(packageJsonPath, currentDependencies) {
  if (!currentDependencies) {
    return false;
  }
  if (!existsSync(packageJsonPath)) {
    return true;
  }
  const oldDependencies = readJSONSync(packageJsonPath).dependencies;
  return !isObjectValueEqual(currentDependencies, oldDependencies);
}

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
      const writePath = join(distDir, 'package.json');
      if (shouldWritePackageJson(writePath, this.dependencies)) {
        writeJSONSync(writePath, { dependencies: this.dependencies });
        packageJsonFilePath.push('');
      }
      if (this.subPackages) {
        this.subPackages.forEach(({ dependencies = {}, source = '' }) => {
          const writePath = join(distDir, dirname(source), 'package.json');
          if (shouldWritePackageJson(writePath, dependencies)) {
            writeJSONSync(writePath, { dependencies });
            packageJsonFilePath.push(dirname(source));
          }
        });
      }

      if (!this.autoInstall || packageJsonFilePath.length === 0) {
        return callback();
      }
      await autoInstallNpm(callback, { distDir, packageJsonFilePath });
    });
  }
};
