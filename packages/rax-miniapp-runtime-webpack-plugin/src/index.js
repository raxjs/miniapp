const { resolve, join, dirname } = require('path');
const { readJsonSync, existsSync } = require('fs-extra');
const execa = require('execa');
const { checkAliInternal } = require('ice-npm-utils');
const isEqual = require('lodash.isequal');
const { MINIAPP } = require('./constants');
const isCSSFile = require('./utils/isCSSFile');
const wrapChunks = require('./utils/wrapChunks');
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

const PluginName = 'MiniAppRuntimePlugin';

class MiniAppRuntimePlugin {
  constructor(options) {
    this.options = options;
    this.target = options.target || MINIAPP;
  }

  apply(compiler) {
    const rootDir = __dirname;
    const options = this.options;
    const target = this.target;
    const { nativeLifeCycleMap, usingComponents = {}, usingPlugins = {}, routes = [], command } = options;
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
          wrapChunks(compilation, chunks, rootDir, target);
          callback();
        }
      );
    });

    compiler.hooks.emit.tapAsync(PluginName, (compilation, callback) => {
      const outputPath = compilation.outputOptions.path;
      const sourcePath = join(options.rootDir, 'src');
      const pages = [];
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


      // Collect asset
      routes
        .forEach(({ entryName }) => {
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
              rootDir,
              outputPath
            });

            // Page css
            generatePageCSS(compilation, entryName, {
              target,
              command,
            });

            // Page json
            generatePageJSON(
              compilation,
              pageConfig,
              useComponent,
              entryName,
              { target, command, rootDir, outputPath }
            );
          }

          // Page js
          generatePageJS(
            compilation,
            entryName,
            nativeLifeCycles,
            { target, command, rootDir, outputPath }
          );
        });

      // These files need be written in first render
      if (isFirstRender) {
        // render.js
        generateRender(compilation, { target, command, rootDir: options.rootDir });
      }

      // Collect app.js
      if (isFirstRender) {
        const commonAppJSFilePaths = compilation.entrypoints
          .get('index')
          .getFiles()
          .filter((filePath) => !isCSSFile(filePath));
        // App js
        generateAppJS(compilation, commonAppJSFilePaths, {
          target,
          command,
          rootDir,
        });
      }

      if (
        isFirstRender ||
        changedFiles.some((filePath) => isCSSFile(filePath))
      ) {
        generateAppCSS(compilation, { target, command, rootDir });
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
          rootDir,
        });


        // Only when developer may use native component, it will generate package.json in output
        if (useNativeComponentCount > 0 || existsSync(join(sourcePath, 'public'))) {
          generatePkg(compilation, {
            target,
            command,
            rootDir,
          });
          needAutoInstallDependency = true;
        }

        if (target !== MINIAPP || useComponent) {
          // Generate self loop element
          generateElementJS(compilation, {
            target,
            command,
            rootDir,
          });
          generateElementJSON(compilation, {
            usingComponents,
            usingPlugins,
            target,
            command,
            rootDir,
          });
          generateElementTemplate(compilation, {
            usingPlugins,
            usingComponents,
            target,
            command,
            rootDir,
          });
        } else {
          // Only when there isn't native component, it need generate root template file
          // Generate root template xml
          generateRootTmpl(compilation, {
            target,
            command,
            rootDir,
            usingPlugins,
            usingComponents,
          });
        }
      }

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
