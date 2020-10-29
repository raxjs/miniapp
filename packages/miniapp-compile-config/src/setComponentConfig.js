const { platformMap } = require('miniapp-builder-shared');
const { existsSync } = require('fs-extra');
const { resolve } = require('path');
const setBaseConfig = require('./setBaseConfig');

module.exports = (
  config,
  userConfig = {},
  { context, target, entryPath, outputPath }
) => {
  const platformInfo = platformMap[target];
  const {
    turnOffSourceMap = false,
    constantDir = []
  } = userConfig;
  const { rootDir, command } = context;

  let disableCopyNpm;

  if (Object.prototype.hasOwnProperty.call(userConfig, 'disableCopyNpm')) {
    disableCopyNpm = userConfig.disableCopyNpm;
  } else {
    disableCopyNpm = command === 'build';
  }

  const loaderParams = {
    mode: command,
    entryPath,
    outputPath,
    disableCopyNpm,
    turnOffSourceMap,
    platform: platformInfo,
  };

  config.entryPoints.clear();
  config.entry('component').add(`./${entryPath}?role=component`);

  // Set constantDir
  // `public` directory is the default static resource directory
  const isPublicFileExist = existsSync(resolve(rootDir, 'src/public'));

  // To make old `constantDir` param compatible
  loaderParams.constantDir = isPublicFileExist
    ? ['src/public'].concat(constantDir)
    : constantDir;

  setBaseConfig(config, userConfig, {
    context,
    entryPath,
    outputPath,
    loaderParams,
    target,
  });
};
