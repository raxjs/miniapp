const path = require('path');
const fs = require('fs-extra');
const ProgressPlugin = require('webpackbar');
const Chain = require('webpack-chain');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getWebpackConfig = require('rax-webpack-config').default;
const getBabelConfig = require('rax-babel-config');
const { setPluginConfig: setRuntimePluginConfig } = require('miniapp-runtime-config');
const { setPluginConfig } = require('miniapp-compile-config');
const atImport = require('postcss-import');
const { platformMap } = require('miniapp-builder-shared');

const ProcessPluginJsonPlugin = require('./plugins/ProcessPluginJson');
const formatPath = require('./utils/formatPath');

const EntryLoader = require.resolve('./loaders/EntryLoader');

module.exports = (options) => {
  const { isRuntimeProject, mode, target, api, outputPath } = options;
  const { context } = api;
  const { rootDir, userConfig } = context;
  if (!isRuntimeProject) {
    const config = new Chain();
    config.plugin('processPluginJson').use(ProcessPluginJsonPlugin, [{ outputPath, rootDir, target }]);
    return setPluginConfig(config, userConfig[target] || {}, { context, target, outputPath });
  } else {
    const babelConfig = getBabelConfig({ styleSheet: false, disableRegenerator: true });
    const webpackConfig = getWebpackConfig({rootDir, mode, babelConfig, target});

    webpackConfig
      .plugin('ProgressPlugin')
      .use(ProgressPlugin, [{ color: '#F4AF3D', name: platformMap[target].name }]);

    const needCopyDirs = [];

    // Copy miniapp-native dir
    needCopyDirs.push({
      from: '**/miniapp-native/**',
      to: outputPath,
      context: path.resolve(rootDir, 'src'),
    });


    // Copy src/public dir
    const publicDir = path.resolve(rootDir, 'src', 'public');
    if (fs.existsSync(publicDir)) {
      needCopyDirs.push({
        from: publicDir,
        to: path.resolve(outputPath, 'public')
      });
    }

    webpackConfig.plugin('CopyWebpackPlugin').use(CopyWebpackPlugin, [needCopyDirs]);

    ['jsx', 'tsx'].forEach((ruleName) => {
      webpackConfig.module
        .rule(ruleName)
        .use('platform-loader')
        .loader(require.resolve('rax-platform-loader'))
        .options({
          platform: target,
        });
    });

    webpackConfig.module
      .rule('pluginJSON')
      .type('javascript/auto')
      .test(/plugin\.json$/)
      .use('babel-loader')
      .loader(require.resolve('babel-loader'))
      .options(babelConfig)
      .end()
      .use('loader')
      .loader(require.resolve('./loaders/PluginConfigLoader'));

    ['css', 'less', 'scss'].forEach(style => {
      webpackConfig.module
        .rule(style)
        .use('postcss-loader')
        .tap((options) => {
          return {
            ...options,
            plugins: [ atImport() ]
          };
        })
        .end();
    });

    webpackConfig
      .entry('bundle')
      .add(`${EntryLoader}!${formatPath(path.join(rootDir, './src/plugin.json'))}`);

    webpackConfig
      .output
      .path(outputPath);

    setRuntimePluginConfig(webpackConfig, { api, target, modernMode: true, outputPath });

    webpackConfig.plugin('processPluginJson').use(ProcessPluginJsonPlugin, [{ outputPath, rootDir, target }]);

    if (mode === 'production') {
      webpackConfig.optimization.minimize(true);
    }

    return webpackConfig;
  }
};
