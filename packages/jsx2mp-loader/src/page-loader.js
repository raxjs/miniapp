const { existsSync, mkdirpSync, readJSONSync, extname } = require('fs-extra');
const { relative, join, dirname, resolve } = require('path');
const { constants: { QUICKAPP }} = require('miniapp-builder-shared');
const { getOptions } = require('loader-utils');
const chalk = require('chalk');
const { minify } = require('./utils/minifyCode');
const cached = require('./cached');
const { removeExt, isFromTargetDirs, doubleBackslash, normalizeOutputFilePath, addRelativePathPrefix, getHighestPriorityPackage } = require('./utils/pathHelper');
const eliminateDeadCode = require('./utils/dce');
const processCSS = require('./styleProcessor');
const { isTypescriptFile } = require('./utils/judgeModule');
const parse = require('./utils/parseRequest');
const { output, writeFileWithDirCheck } = require('./output');
const { getCache, getCacheDirName } = require('./utils/useCache');

const ScriptLoader = require.resolve('./script-loader');

const MINIAPP_PLUGIN_COMPONENTS_REG = /^plugin\:\/\//;

module.exports = async function pageLoader(content) {
  const query = parse(this.request);
  // Only handle page role file
  if (query.role !== 'page') {
    return content;
  }

  const loaderOptions = getOptions(this);
  const { rootDir, platform, entryPath, mode, disableCopyNpm, constantDir, turnOffSourceMap, outputPath, aliasEntries, injectAppCssComponent, cache } = loaderOptions;
  const resourcePath = this.resourcePath;
  const rootContext = this.rootContext;
  const isQuickApp = platform.type === QUICKAPP;
  const absoluteConstantDir = constantDir.map(dir => join(rootContext, dir));

  const sourcePath = join(rootContext, dirname(entryPath));
  const relativeSourcePath = relative(sourcePath, this.resourcePath);
  const targetFilePath = join(outputPath, relativeSourcePath);

  const isFromConstantDir = cached(isFromTargetDirs(absoluteConstantDir));
  const distFileWithoutExt = removeExt(join(outputPath, relativeSourcePath), platform.type);
  const outputPathCode = distFileWithoutExt + '.js';
  const pageConfigPath = distFileWithoutExt + '.json';
  const outputPathJson = pageConfigPath;
  const outputPathCss = distFileWithoutExt + platform.extension.css;
  const outputPathTemplate = distFileWithoutExt + platform.extension.xml;

  const cacheDirectory = getCacheDirName({ config: cache, mode });
  const cacheContent = getCache({ filePath: this.resourcePath, cacheDirectory: join(rootDir, cacheDirectory) });

  function isCustomComponent(name, usingComponents = {}) {
    const matchingPath = join(dirname(resourcePath), name);
    for (let key in usingComponents) {
      if (
        usingComponents.hasOwnProperty(key)
        && usingComponents[key]
        && usingComponents[key].indexOf(matchingPath) === 0
      ) {
        return true;
      }
    }
    return false;
  }

  // cache and cacheContent exsit
  if (cache && cacheContent) {
    if (cacheContent.code) {
      writeFileWithDirCheck( outputPathCode, cacheContent.code, { rootDir });
    }

    if (cacheContent.json) {
      writeFileWithDirCheck( outputPathJson, cacheContent.json, { rootDir, type: 'json' });
    }

    if (cacheContent.template) {
      writeFileWithDirCheck( outputPathTemplate, cacheContent.template, { rootDir });
    }

    if (cacheContent.css) {
      writeFileWithDirCheck( outputPathCss, cacheContent.css, { rootDir });
    }

    const assets = cacheContent.assets;
    if (assets && Object.keys(assets).length) {
      Object.keys(assets).forEach((asset) => {
        const ext = extname(asset);
        let content = assets[asset];
        if (content) {
          if (isQuickApp) {
            content = content.replace(/rpx/g, 'px');
          }
          if (mode === 'build') {
            content = minify(content, ext);
          }
          const assetsOutputPath = join(outputPath, asset);
          console.log('assetsOutputPath', assetsOutputPath, asset);
          writeFileWithDirCheck(assetsOutputPath, content, { rootDir });
        }
      });
    }

    const dependencies = [];
    if (cacheContent.imported) {
      const imported = cacheContent.imported;
      Object.keys(imported).forEach(name => {
        if (isCustomComponent(name, cacheContent.usingComponents)) {
          const componentPath = resolve(dirname(resourcePath), name);
          dependencies.push({
            name: isFromConstantDir(componentPath) ? name : `${name}?role=component`, // Native miniapp component js file will loaded by script-loader
            options: loaderOptions
          });
        } else {
          const importedArray = imported[name];
          let entirePush = false;
          importedArray.forEach(importedContent => {
            // Component library
            if (importedContent.isFromComponentLibrary) {
              dependencies.push({
                name,
                loader: ScriptLoader,
                options: Object.assign({}, loaderOptions, {
                  importedComponent: importedContent.local
                })
              });
            } else {
              if (!entirePush) {
                dependencies.push({ name });
                entirePush = true;
              }
            }
          });
        }
      });
    }


    return [
      `/* Generated by JSX2MP ComponentLoader, sourceFile: ${this.resourcePath}. */`,
      generateDependencies(dependencies),
    ].join('\n');
  } else {
    const JSXCompilerPath = getHighestPriorityPackage('jsx-compiler', this.rootContext);
    const compiler = require(JSXCompilerPath);

    const compilerOptions = Object.assign({}, compiler.baseOptions, {
      resourcePath: this.resourcePath,
      outputPath,
      sourcePath,
      type: 'page',
      platform,
      sourceFileName: this.resourcePath,
      disableCopyNpm,
      turnOffSourceMap,
      aliasEntries
    });
    const rawContentAfterDCE = eliminateDeadCode(content);

    let transformed;
    try {
      transformed = compiler(rawContentAfterDCE, compilerOptions);
    } catch (e) {
      console.log(chalk.red(`\n[${platform.name}] Error occured when handling Page ${this.resourcePath}`));
      if (process.env.DEBUG === 'true') {
        throw new Error(e);
      } else {
        const errMsg = e.node ? `${e.message}\nat ${this.resourcePath}` : `Unknown compile error! please check your code at ${this.resourcePath}`;
        throw new Error(errMsg);
      }
    }

    const { style, assets } = await processCSS(transformed.cssFiles, sourcePath);
    transformed.style = style;
    transformed.assets = assets;

    const pageDistDir = dirname(targetFilePath);
    if (!existsSync(pageDistDir)) mkdirpSync(pageDistDir);

    let config = {
      ...transformed.config
    };
    if (existsSync(pageConfigPath)) {
      const pageConfig = readJSONSync(pageConfigPath);
      delete pageConfig.usingComponents;
      Object.assign(config, pageConfig);
    }
    if (Array.isArray(transformed.dependencies)) {
      transformed.dependencies.forEach(dep => {
        this.addDependency(dep);
      });
    }

    if (config.usingComponents) {
      const usingComponents = {};
      Object.keys(config.usingComponents).forEach(key => {
        const value = config.usingComponents[key];
        if (/^c-/.test(key)) {
          const result = MINIAPP_PLUGIN_COMPONENTS_REG.test(value) ? value : removeExt(addRelativePathPrefix(relative(dirname(this.resourcePath), value)));
          usingComponents[key] = normalizeOutputFilePath(result);
        } else {
          usingComponents[key] = normalizeOutputFilePath(value);
        }
      });
      config.usingComponents = usingComponents;
    }

    // Only works when developing miniapp plugin, to declare the use of __app_css component
    if (injectAppCssComponent) {
      const appCssComponentPath = resolve(outputPath, '__app_css', 'index');
      const relativeAppCssComponentPath = addRelativePathPrefix(relative(pageDistDir, appCssComponentPath));
      config.usingComponents = {
        '__app_css': relativeAppCssComponentPath,
        ...config.usingComponents
      };
    }

    const outputContent = {
      code: transformed.code,
      map: transformed.map,
      css: transformed.style || '',
      json: config,
      template: transformed.template,
      assets: transformed.assets,
      importComponents: transformed.importComponents,
      iconfontMap: transformed.iconfontMap,
      imported: transformed.imported,
      usingComponents: transformed.usingComponents

    };
    const outputOption = {
      outputPath: {
        code: distFileWithoutExt + '.js',
        json: pageConfigPath,
        css: distFileWithoutExt + platform.extension.css,
        template: distFileWithoutExt + platform.extension.xml,
        assets: outputPath
      },
      cache,
      mode,
      platform,
      isTypescriptFile: isTypescriptFile(this.resourcePath),
      rootDir,
      resourcePath: this.resourcePath
    };

    output(outputContent, content, outputOption);

    const dependencies = [];
    Object.keys(transformed.imported).forEach(name => {
      if (isCustomComponent(name, transformed.usingComponents)) {
        const componentPath = resolve(dirname(resourcePath), name);
        dependencies.push({
          name: isFromConstantDir(componentPath) ? name : `${name}?role=component`, // Native miniapp component js file will be loaded by script-loader
          options: loaderOptions
        });
      } else {
        const importedArray = transformed.imported[name];
        let entirePush = false;
        importedArray.forEach(importedContent => {
          // Component library
          if (importedContent.isFromComponentLibrary) {
            dependencies.push({
              name,
              loader: ScriptLoader,
              options: Object.assign({}, loaderOptions, {
                importedComponent: importedContent.local
              })
            });
          } else {
            if (!entirePush) {
              dependencies.push({ name });
              entirePush = true;
            }
          }
        });
      }
    });
    return [
      `/* Generated by JSX2MP PageLoader, sourceFile: ${this.resourcePath}. */`,
      generateDependencies(dependencies),
    ].join('\n');
  }
};

function createImportStatement(req) {
  return `import '${doubleBackslash(req)}';`;
}

function generateDependencies(dependencies) {
  return dependencies
    .map(({ name, loader, options }) => {
      let mod = name;
      if (loader) mod = loader + '?' + JSON.stringify(options) + '!' + mod;
      return createImportStatement(mod);
    })
    .join('\n');
}

