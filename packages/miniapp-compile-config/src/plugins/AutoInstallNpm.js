const { autoInstallNpm } = require('miniapp-builder-shared');
const { writeJSONSync, existsSync, readJSONSync } = require('fs-extra');
const { join, dirname } = require('path');

function isObjectValueEqual(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    var propA = a[propName];
    var propB = b[propName];
    if ( propA !== propB) {
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
  if (isObjectValueEqual(currentDependencies, oldDependencies)) {
    return false;
  }
  return true;
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
