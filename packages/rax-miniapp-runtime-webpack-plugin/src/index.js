const { resolve, join } = require('path');
const { readJsonSync, existsSync } = require('fs-extra');
const execa = require('execa');
const { checkAliInternal } = require('ice-npm-utils');
const isEqual = require('lodash.isequal');
const { constants: { MINIAPP } } = require('miniapp-builder-shared');
const { UNRECURSIVE_TEMPLATE_TYPE } = require('./constants');
const isCSSFile = require('./utils/isCSSFile');
const wrapChunks = require('./utils/wrapChunks');
const getSepProcessedPath = require('./utils/getSepProcessedPath');
const { pathHelper: { getBundlePath }} = require('miniapp-builder-shared');

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
    const { api, nativeLifeCycleMap, usingComponents = {}, usingPlugins = {}, routes = [], mainPackageRoot } = options;
    const { context: { command, userConfig: rootUserConfig, rootDir }, getValue } = api;
    const userConfig = rootUserConfig[target] || {};
    const { subPackages } = userConfig;
    let isFirstRender = true;
    let lastUsingComponents = {};
    let lastUsingPlugins = {};
    let needAutoInstallDependency = false;
    let isAliInternal;
    let npmRegistry;

    // Execute when compilation created
    compiler.hooks.compilation.tap(PluginName, (compilation) => {
      // Optimize chunk assets
      compilation.hooks.optimizeChunkAssets.tapAsync(
        PluginName,
        (chunks, callback) => {
          wrapChunks(compilation, chunks, pluginDir, target);
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

      let useComponentChanged = false;
      if (!isFirstRender) {
        useComponentChanged = !isEqual(usingComponents, lastUsingComponents) || !isEqual(usingPlugins, lastUsingPlugins);
      }
      lastUsingComponents = Object.assign({}, usingComponents);
      lastUsingPlugins = Object.assign({}, usingPlugins);
      const useComponent = Object.keys(lastUsingPlugins).length + Object.keys(lastUsingComponents).length > 0;

      // These files need be written in first render
      if (isFirstRender) {
        // render.js
        generateRender(compilation, { target, command, rootDir });
        // Collect app.js
        const commonAppJSFilePaths = compilation.entrypoints
          .get(getBundlePath(subPackages ? mainPackageRoot : '' ))
          .getFiles()
          .filter((filePath) => !isCSSFile(filePath));
        // App js
        generateAppJS(compilation, commonAppJSFilePaths, mainPackageRoot, {
          target,
          command,
          pluginDir,
        });
      }

      if (
        isFirstRender ||
        changedFiles.some((filePath) => isCSSFile(filePath))
      ) {
        generateAppCSS(compilation, { subPackages, target, command, pluginDir });
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
        });

        // Only when developer may use native component, it will generate package.json in output
        if (useNativeComponentCount > 0 || existsSync(join(sourcePath, 'public'))) {
          generatePkg(compilation, {
            target,
            command,
          });
          needAutoInstallDependency = true;
        }

        if (UNRECURSIVE_TEMPLATE_TYPE.has(target) || useComponent) {
          // Generate self loop element
          generateElementJS(compilation, {
            target,
            command,
          });
          generateElementJSON(compilation, {
            usingComponents,
            usingPlugins,
            target,
            command,
          });
          generateElementTemplate(compilation, {
            usingPlugins,
            usingComponents,
            target,
            command,
            pluginDir,
            api
          });
        } else {
          // Only when there isn't native component, it need generate root template file
          // Generate root template xml
          generateRootTmpl(compilation, {
            target,
            command,
            pluginDir,
            usingPlugins,
            usingComponents,
            api
          });
        }
      }

      // Collect asset
      routes
        .forEach(({ entryName, subAppRoot, source }) => {
          pages.push(entryName);
          let pageConfig = {};
          const pageConfigPath = resolve(outputPath, entryName + '.json');
          if (existsSync(pageConfigPath)) {
            pageConfig = readJsonSync(pageConfigPath);
          }

          const pageRoute = join(sourcePath, entryName);
          const nativeLifeCycles =
            nativeLifeCycleMap[pageRoute] || {};
          const route = routes.find(({ source }) => source === entryName);
          if (route.window && route.window.pullRefresh) {
            nativeLifeCycles.onPullDownRefresh = true;
            // onPullIntercept only exits in wechat miniprogram
            if (target === MINIAPP) {
              nativeLifeCycles.onPullIntercept = true;
            }
          }

          // xml/css/json file need be written in first render or using native component state changes
          if (isFirstRender || useComponentChanged) {
            // Page xml
            generatePageXML(compilation, entryName, useComponent, {
              target,
              command,
              outputPath
            });

            // Page css
            generatePageCSS(compilation, entryName, subAppRoot, {
              target,
              command,
            });

            // Page json
            generatePageJSON(
              compilation,
              pageConfig,
              useComponent,
              usingComponents, usingPlugins,
              entryName,
              { target, command, outputPath }
            );
          }
          let commonPageJSFilePaths = [];
          if (subPackages && mainPackageRoot !== subAppRoot) {
            commonPageJSFilePaths = compilation.entrypoints.get(getBundlePath(subAppRoot))
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
            { target, command, pluginDir, outputPath }
          );
        });

      isFirstRender = false;
      callback();
    });
    compiler.hooks.done.tapAsync(PluginName, async(stats, callback) => {
      if (!needAutoInstallDependency) {
        return callback();
      }
      if (isAliInternal === undefined) {
        isAliInternal = await checkAliInternal();
        npmRegistry = isAliInternal ? 'https://registry.npm.alibaba-inc.com' : 'https://registry.npm.taobao.org';
      }
      const distDir = stats.compilation.outputOptions.path;
      execa('npm', ['install', '--production', `--registry=${npmRegistry}`], { cwd: distDir }).then(({ exitCode }) => {
        if (!exitCode) {
          callback();
        } else {
          console.log(`\nInstall dependencies failed, please enter ${distDir} and retry by yourself\n`);
          callback();
        }
      }).catch(() => {
        console.log(`\nInstall dependencies failed, please enter ${distDir} and retry by yourself\n`);
        callback();
      });
    });
  }
}

module.exports = MiniAppRuntimePlugin;
