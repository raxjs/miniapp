const { resolve, join } = require('path');
const { readJsonSync, existsSync } = require('fs-extra');
const isEqual = require('lodash.isequal');
const { constants: { MINIAPP } } = require('miniapp-builder-shared');
const { UNRECURSIVE_TEMPLATE_TYPE } = require('./constants');
const isCSSFile = require('./utils/isCSSFile');
const wrapChunks = require('./utils/wrapChunks');
const getSepProcessedPath = require('./utils/getSepProcessedPath');
const { filterPlugin, filterComponent } = require('./utils/filterNativeComponentConfig');
const { pathHelper: { getBundlePath }, autoInstallNpm } = require('miniapp-builder-shared');

const {
  generateAppCSS,
  generateAppJS,
  generateConfig,
  generatePageCSS,
  generatePageJS,
  generatePageJSON,
  generatePageXML,
  generateRootTmpl,
  generateElementJS,
  generateElementJSON,
  generateElementTemplate,
  generateRender,
  generatePkg
} = require('./generators');
const getFinalRouteMap = require('./utils/getFinalRouteMap');

const PluginName = 'MiniAppRuntimePlugin';

class MiniAppRuntimePlugin {
  constructor(options) {
    this.options = options;
    this.target = options.target || MINIAPP;
  }

  apply(compiler) {
    const pluginDir = __dirname;
    const options = this.options;
    const target = this.target;
    const {
      api,
      nativeLifeCycleMap,
      usingComponents = {},
      usingPlugins = {},
      routes = [],
      mainPackageRoot,
      appConfig,
      subAppConfigList = [],
    } = options;
    const {
      context: { command, userConfig: rootUserConfig, rootDir },
      getValue
    } = api;
    const userConfig = rootUserConfig[target] || {};
    const { subPackages, template: modifyTemplate = {}, nativePackage = {} } = userConfig;
    let isFirstRender = true;
    let lastUsingComponents = {};
    let lastUsingPlugins = {};
    let needAutoInstallDependency = false;

    // Execute when compilation created
    compiler.hooks.compilation.tap(PluginName, (compilation) => {
      // Optimize chunk assets
      compilation.hooks.optimizeChunkAssets.tapAsync(
        PluginName,
        (chunks, callback) => {
          wrapChunks(compilation, chunks, target);
          callback();
        }
      );
    });

    compiler.hooks.emit.tapAsync(PluginName, (compilation, callback) => {
      const outputPath = compilation.outputOptions.path;
      const sourcePath = join(rootDir, 'src');
      const pages = [];
      const finalRouteMap = getFinalRouteMap(getValue('staticConfig'));
      const changedFiles = Object.keys(
        compiler.watchFileSystem.watcher.mtimes
      ).map((filePath) => {
        return filePath.replace(sourcePath, '');
      });
      const useNativeComponentCount = Object.keys(usingComponents).length;

      // For sub packages mode use
      let mainPackageUsingPlugins = usingPlugins;
      let mainPackageUsingComponents = usingComponents;

      let useComponentChanged = false;
      if (!isFirstRender) {
        useComponentChanged =
          !isEqual(usingComponents, lastUsingComponents) ||
          !isEqual(usingPlugins, lastUsingPlugins);
      }
      lastUsingComponents = Object.assign({}, usingComponents);
      lastUsingPlugins = Object.assign({}, usingPlugins);
      const useComponent =
        Object.keys(lastUsingPlugins).length +
          Object.keys(lastUsingComponents).length >
        0;
      // These files need be written in first render
      if (isFirstRender) {
        // render.js
        generateRender(compilation, { target, command, rootDir });
        // Collect app.js
        const commonAppJSFilePaths = compilation.entrypoints
          .get(getBundlePath(subPackages ? mainPackageRoot : ''))
          .getFiles()
          .filter((filePath) => !isCSSFile(filePath));
        // App js
        const nativeAppConfigPath = join(sourcePath, 'miniapp-native', 'app.js');
        const withNativeAppConfig = existsSync(nativeAppConfigPath); // Check whether the developer has his own native app config
        generateAppJS(compilation, commonAppJSFilePaths, mainPackageRoot, {
          target,
          command,
          withNativeAppConfig
        });
      }

      if (
        isFirstRender ||
        changedFiles.some((filePath) => isCSSFile(filePath))
      ) {
        generateAppCSS(compilation, {
          subPackages,
          target,
          command,
          pluginDir
        });
      }

      // These files need be written in first render and using native component state changes
      if (isFirstRender || useComponentChanged) {
        // Config js
        generateConfig(compilation, {
          usingComponents,
          usingPlugins,
          pages,
          target,
          command,
          subPackages
        });

        // Only when developer may use native component, it will generate package.json in output
        if (
          useNativeComponentCount > 0 ||
          existsSync(join(sourcePath, 'public')) ||
          nativePackage.dependencies
        ) {
          generatePkg(compilation, {
            target,
            command,
            declaredDep: nativePackage.dependencies
          });
          needAutoInstallDependency = true;
        }

        if (UNRECURSIVE_TEMPLATE_TYPE.has(target) || useComponent) {
          if (subPackages) {
            mainPackageUsingPlugins = filterPlugin(appConfig, usingPlugins);
            mainPackageUsingComponents = filterComponent(usingComponents);
          }
          // Generate self loop element
          generateElementJS(compilation, {
            target,
            command
          });
          generateElementJSON(compilation, {
            usingComponents: mainPackageUsingComponents,
            usingPlugins: mainPackageUsingPlugins,
            target,
            command
          });
          generateElementTemplate(compilation, {
            usingComponents: mainPackageUsingComponents,
            usingPlugins: mainPackageUsingPlugins,
            target,
            command,
            modifyTemplate
          });
        } else {
          // Only when there isn't native component, it need generate root template file
          // Generate root template xml
          generateRootTmpl(compilation, {
            target,
            command,
            usingPlugins,
            usingComponents,
            modifyTemplate
          });
        }
      }

      // Collect asset
      routes.forEach(({ entryName, subAppRoot, source }) => {
        pages.push(entryName);
        let pageConfig = {};
        const pageConfigPath = resolve(outputPath, entryName + '.json');
        if (existsSync(pageConfigPath)) {
          pageConfig = readJsonSync(pageConfigPath);
        }

        const pageRoute = join(sourcePath, entryName);
        const nativeLifeCycles = nativeLifeCycleMap[pageRoute] || {};
        const route = routes.find(({ source }) => source === entryName);
        if (route.window && route.window.pullRefresh) {
          nativeLifeCycles.onPullDownRefresh = true;
          // onPullIntercept only exits in wechat miniprogram
          if (target === MINIAPP) {
            nativeLifeCycles.onPullIntercept = true;
          }
        }

        let subPackageUsingComponents = Object.assign({}, mainPackageUsingComponents);
        let subPackageUsingPlugins = Object.assign({}, mainPackageUsingPlugins);
        let isSubPackageContainsNativeComponent = false;
        let isSubPackageContainsPlugin = false;

        if (subPackages) {
          // Check if miniapp-native dir exist in sub package root
          const subPackageNativeComponentPath = join(sourcePath, subAppRoot, 'miniapp-native');
          isSubPackageContainsNativeComponent = existsSync(subPackageNativeComponentPath);
          if (isSubPackageContainsNativeComponent) {
            subPackageUsingComponents = filterComponent(usingComponents, 'sub', subAppRoot);
          }

          // Check if plugin config in sub package json file
          const subPackageConfigWithPlugin = subAppConfigList.find((config) => {
            return config.subAppRoot === subAppRoot && !!config.plugins;
          });
          isSubPackageContainsPlugin = subPackageConfigWithPlugin;
          if (isSubPackageContainsPlugin) {
            subPackageUsingPlugins = Object.assign(
              {},
              mainPackageUsingPlugins,
              filterPlugin(subPackageConfigWithPlugin, usingPlugins)
            );
          }
          // xml related files need to be generated in sub packages independently if plugin config exists or miniapp-native dir exists in sub packages
          if (isSubPackageContainsNativeComponent || isSubPackageContainsPlugin) {
            generateElementJS(compilation, {
              target,
              command,
              subAppRoot
            });
            generateElementJSON(compilation, {
              usingComponents: subPackageUsingComponents,
              usingPlugins: subPackageUsingPlugins,
              target,
              command,
              subAppRoot
            });
            generateElementTemplate(compilation, {
              usingComponents: subPackageUsingComponents,
              usingPlugins: subPackageUsingPlugins,
              target,
              command,
              modifyTemplate,
              subAppRoot
            });
          }
        }

        // xml/css/json file need be written in first render or using native component state changes
        if (isFirstRender || useComponentChanged) {
          // Page xml
          generatePageXML(compilation, entryName, useComponent, {
            target,
            command,
            subAppRoot: isSubPackageContainsPlugin || isSubPackageContainsNativeComponent ? subAppRoot : ''
          });

          // Page css
          generatePageCSS(compilation, entryName, subAppRoot, {
            target,
            command,
          });

          const isSubPackagePage = subPackages && mainPackageRoot !== subAppRoot;
          // Page json
          generatePageJSON(
            compilation,
            pageConfig,
            useComponent,
            isSubPackagePage ? subPackageUsingComponents : mainPackageUsingComponents,
            isSubPackagePage ? subPackageUsingPlugins : mainPackageUsingPlugins,
            entryName,
            {
              target,
              command,
              outputPath,
              subAppRoot: isSubPackageContainsPlugin || isSubPackageContainsNativeComponent ? subAppRoot : ''
            }
          );
        }
        let commonPageJSFilePaths = [];
        if (subPackages && mainPackageRoot !== subAppRoot) {
          commonPageJSFilePaths = compilation.entrypoints
            .get(getBundlePath(subAppRoot))
            .getFiles()
            .filter((filePath) => !isCSSFile(filePath));
        }
        let pagePath = entryName;
        if (!subPackages) {
          pagePath = finalRouteMap[getSepProcessedPath(source)];
        }
        // Page js
        generatePageJS(
          compilation,
          entryName,
          pagePath,
          nativeLifeCycles,
          commonPageJSFilePaths,
          subAppRoot,
          { target, command }
        );
      });

      isFirstRender = false;
      callback();
    });
    compiler.hooks.done.tapAsync(PluginName, async(stats, callback) => {
      if (nativePackage.autoInstall === false || !needAutoInstallDependency) {
        return callback();
      }
      const distDir = stats.compilation.outputOptions.path;
      await autoInstallNpm(distDir, callback);
    });
  }
}

module.exports = MiniAppRuntimePlugin;
