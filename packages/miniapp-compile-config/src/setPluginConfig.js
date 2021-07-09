const webpack = require('webpack');
const { resolve } = require('path');
const {
  platformMap
} = require('miniapp-builder-shared');
const { existsSync, readJSONSync } = require('fs-extra');

const PageLoader = require.resolve('jsx2mp-loader/src/page-loader');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const GenerateAppCssPlugin = require('./plugins/GenerateAppCss');

const setBaseConfig = require('./setBaseConfig');
const { setPluginEntry } = require('./setEntry');

function getPluginConfig(rootDir) {
  const pluginConfig = readJSONSync(resolve(rootDir, 'src', 'plugin.json'));
  return pluginConfig;
};

module.exports = (
  config,
  userConfig = {},
  { context, target, outputPath }
) => {
  const platformInfo = platformMap[target];
  const {
    disableCopyNpm = false,
    turnOffSourceMap = false,
  } = userConfig;
  const { rootDir, command } = context;
  const mode = command;

  const entryPath = './src/index';

  const pluginConfig = getPluginConfig(rootDir);

  const isPublicFileExist = existsSync(resolve(rootDir, 'src/public'));
  const constantDir = isPublicFileExist ? ['src/public'] : [];

  const loaderParams = {
    mode,
    entryPath,
    outputPath,
    constantDir,
    disableCopyNpm,
    turnOffSourceMap,
    injectAppCssComponent: true,
    platform: platformInfo
  };

  const pageLoaderParams = {
    ...loaderParams,
    entryPath,
  };

  setPluginEntry(config, pluginConfig, entryPath);

  config.context(rootDir);

  // Set base jsx2mp config
  setBaseConfig(config, userConfig, {
    entryPath,
    context,
    loaderParams,
    target,
    outputPath,
  });

  config.devServer.writeToDisk(true).noInfo(true).inline(false);

  // Add app and page jsx2mp loader
  config.module
    .rule('withRoleJSX')
    .use('page')
    .loader(PageLoader)
    .options(pageLoaderParams)
    .end();

  const aliasEntries = config.resolve.alias.entries();
  config.module
    .rule('withRoleJSX')
    .use('page')
    .tap((pageLoaderParams) => {
      return {
        ...pageLoaderParams,
        aliasEntries,
      };
    });

  config.plugin('noError')
    .use(webpack.NoEmitOnErrorsPlugin);

  config.plugin('generateAppCss').use(GenerateAppCssPlugin, [{ outputPath, platformInfo }]);

  // Copy src/miniapp-native dir
  if (existsSync(resolve(rootDir, 'src', 'miniapp-native'))) {
    const needCopyDirs = [{
      from: resolve(rootDir, 'src', 'miniapp-native'),
      to: resolve(outputPath, 'miniapp-native'),
    }];
    config.plugin('CopyWebpackPlugin').use(CopyWebpackPlugin, [
      {
        patterns: needCopyDirs,
      },
    ]);
  }

  return config;
};
