const { join } = require('path');
const { ensureDirSync } = require('fs-extra');
const safeWriteFile = require('./safeWriteFile');
const transformNativeConfig = require('./transformNativeConfig');
const processIconFile = require('./processIconFile');
const { transformAppConfig, transformPageConfig } = require('miniapp-builder-shared');

const PluginName = 'MiniAppConfigPlugin';

module.exports = class MiniAppConfigPlugin {
  constructor(passedOptions) {
    this.options = passedOptions;
  }
  apply(compiler) {
    // Currently there is no watch app.json capacity, so use first render flag handle repeatly write config
    let isFirstRender = true;
    let { subPackages, outputPath, appConfig, subAppConfigList, target, type, nativeConfig } = this.options;
    compiler.hooks.beforeCompile.tapAsync(PluginName, (compilation, callback) => {
      if (isFirstRender) {
        transformConfig(compilation, callback);
        isFirstRender = false;
      } else {
        callback();
      }
    });

    function transformConfig(compilation, callback) {
      const config = transformAppConfig(appConfig, target);
      processIconFile(config, outputPath);
      if (subPackages) {
        // Transform subpackages
        config.subPackages = subAppConfigList
          .filter(subAppConfig => !subAppConfig.miniappMain)
          .map(subAppConfig => transformAppConfig(subAppConfig, target, { subPackages }));

        if (subPackages.shareMemory) {
          config.subPackageBuildType = 'shared';
        }

        // Transform main package pages
        const mainPackageConfig = subAppConfigList.filter(subAppConfig => subAppConfig.miniappMain)[0];
        config.pages = mainPackageConfig.pages;

        config.preloadRule = {};
        // Transform page config
        subAppConfigList.map(subAppConfig => {
          subAppConfig.routes.map((route) => {
            if (route && route.window) {
              ensureDirSync(outputPath);
              const pageConfig = transformPageConfig(route.window, 'window', target);
              safeWriteFile(join(outputPath, route.source + '.json'), pageConfig, true);
            }
            if (route && route.miniappPreloadRule) {
              config.preloadRule[route.source] = route.miniappPreloadRule;
            }
          });
        });
      } else {
        // Transform page config
        appConfig.routes.map((route) => {
          if (route && route.window) {
            ensureDirSync(outputPath);
            const pageConfig = transformPageConfig(route.window, 'window', target);
            safeWriteFile(join(outputPath, route.source + '.json'), pageConfig, true);
          }
        });
      }
      safeWriteFile(join(outputPath, 'app.json'), config, true);
      if (type === 'complie') {
        safeWriteFile(join(outputPath, target === 'quickapp' ? 'appConfig.js' : 'app.config.js'), `module.exports = ${JSON.stringify(subPackages ? config : appConfig, null, 2)}`);
      }

      // Transform native config
      transformNativeConfig(outputPath, nativeConfig, target);
      callback();
    }
  }
};


