const { writeJSONSync, writeFileSync, readFileSync, existsSync, mkdirpSync } = require('fs-extra');
const { extname, dirname, join, relative } = require('path');
const { transformSync } = require('@babel/core');
const { constants: { QUICKAPP }} = require('miniapp-builder-shared');
const { minify, minifyJS, minifyCSS, minifyXML } = require('./utils/minifyCode');
const addSourceMap = require('./utils/addSourceMap');

function transformCode(rawContent, mode, externalPlugins = [], externalPreset = []) {
  const presets = [].concat(externalPreset);
  const plugins = externalPlugins.concat([
    require('@babel/plugin-proposal-export-default-from'), // for support of export default
    [
      require('babel-plugin-transform-define'),
      {
        'process.env.NODE_ENV': mode === 'build' ? 'production' : 'development',
      }
    ],
    [
      require('babel-plugin-minify-dead-code-elimination-while-loop-fixed'),
      {
        optimizeRawSize: true,
        keepFnName: true
      }
    ],
  ]);


  const babelParserOption = {
    plugins: [
      'classProperties',
      'jsx',
      'typescript',
      'trailingFunctionCommas',
      'asyncFunctions',
      'exponentiationOperator',
      'asyncGenerators',
      'objectRestSpread',
      ['decorators', { decoratorsBeforeExport: false }],
      'dynamicImport',
    ], // support all plugins
  };

  return transformSync(rawContent, {
    presets,
    plugins,
    parserOpts: babelParserOption
  });
}

/**
 * Process and write file
 * @param {object} content Compiled result
 * @param {string} raw Original file content
 * @param {object} options
 */
function output(content, raw, options) {
  const { mode, outputPath, externalPlugins = [], isTypescriptFile, platform, type, rootDir } = options;
  let { code, config, json, css, map, template, assets, importComponents = [], iconfontMap } = content;
  const isQuickApp = platform.type === QUICKAPP;

  if (isTypescriptFile) {
    externalPlugins.unshift(require('@babel/plugin-transform-typescript'));
  }

  const transformCodeWithPreset = (code, mode) => transformCode(code, mode,
    externalPlugins.concat([require('@babel/plugin-proposal-class-properties')]),
    [[require('@babel/preset-env'), {
      exclude: ['@babel/plugin-transform-regenerator']
    }]]
  ).code;

  if (mode === 'build') {
    // Compile ES6 => ES5 and minify code
    code && (
      code = minifyJS(transformCodeWithPreset(code, mode))
    );
    config && (
      config = minifyJS(transformCodeWithPreset(config, mode))
    );
    css && (css = minifyCSS(css));
    template && (template = minifyXML(template));
  } else {
    if (code) {
      code = transformCodeWithPreset(code, mode);
      // Add source map
      if (map) {
        code = addSourceMap(code, raw, map);
      }
    }
  }

  // Write file
  if (code) {
    if (isQuickApp) {
      // wrap with script for app.ux
      if (type === 'app') {
        code = `<script>\n${code}\n</script>\n`;
        writeFileWithDirCheck(outputPath.code, code, { rootDir });
        // check if update fns exists
        if (global._appUpdateFns && global._appUpdateFns.length) {
          global._appUpdateFns.map(fn => {
            fn.call();
          });
          global._appUpdateFns = [];
        }
      } else {
        // insert global iconfont in app.ux if iconfont detected in page/component
        if (iconfontMap && iconfontMap.length) {
          const appPath = join(outputPath.assets, 'app.ux');
          let appContent = readFileSync(appPath, 'utf8');
          if (appContent.length) {
            updateAppUx(appContent, iconfontMap, appPath);
          } else {
            // cache update fns in case app.ux is not ready yet
            global._appUpdateFns = global._appUpdateFns || [];
            global._appUpdateFns.push(updateAppUx.bind(null, appContent, iconfontMap, appPath));
          }
        }
      }
    }
    writeFileWithDirCheck(outputPath.code, code, { rootDir });
  }

  if (json) {
    writeFileWithDirCheck(outputPath.json, json, { rootDir, type: 'json' });
  }
  if (template) {
    if (isQuickApp) {
      if (importComponents && importComponents.length) {
        template = `${importComponents.join('\n')}\n${template}\n`;
      }
      if (code) {
        template += `<script>\n${code}\n</script>\n`;
      }
      if (css && outputPath.css) {
        template += `<style src="./${relative(dirname(outputPath.template), outputPath.css)}"></style>\n`;
      } else {
        template += `<style>
    .__rax-view {
      border: 0 solid black;
      display:flex;
      flex-direction:column;
      align-content:flex-start;
      flex-shrink:0;
    }
    </style>\n`;
      }
    }
    writeFileWithDirCheck(outputPath.template, template, { rootDir });
  }
  if (css) {
    if (isQuickApp) {
      // add common style in css files
      if (!css.includes('.__rax-view')) {
        css = `
  .__rax-view {
    border: 0 solid black;
    display:flex;
    flex-direction:column;
    align-content:flex-start;
    flex-shrink:0;
  }
  ${css}`;
      }
      css = css.replace(/rpx/g, 'px');
    }
    writeFileWithDirCheck(outputPath.css, css, { rootDir });
  }
  if (config) {
    writeFileWithDirCheck(outputPath.config, config, { rootDir });
  }

  // Write extra assets
  if (assets) {
    Object.keys(assets).forEach((asset) => {
      const ext = extname(asset);
      let content = assets[asset];
      if (isQuickApp) {
        content = content.replace(/rpx/g, 'px');
      }
      if (mode === 'build') {
        content = minify(content, ext);
      }
      const assetsOutputPath = join(outputPath.assets, asset);
      writeFileWithDirCheck(assetsOutputPath, content, { rootDir });
    });
  }
}

/**
 * Insert iconfont configure in app.ux
 * @param {string} appContent Content of compiled app.ux
 * @param {object} iconfontMap Compiled iconfont's map
 * @param {string} appPath Path for app.ux
 */
function updateAppUx(appContent, iconfontMap, appPath) {
  const insertIndex = appContent.indexOf('</style>');
  if (insertIndex < 0) {
    appContent = `${appContent}\n<style>\n${iconfontMap.map((v) => {
      return `@font-face {
  font-family: ${v.fontFamily};
  src: url('${v.url}');
}
.${v.iconClass} {
  font-family: ${v.fontFamily};
}`;
    }).join('\n')}\n</style>`;
  } else {
    appContent = `${appContent.substr(0, insertIndex)}\n${iconfontMap.map((v) => {
      return `@font-face {
  font-family: ${v.fontFamily};
  src: url('${v.url}');
}
.${v.iconClass} {
  font-family: ${v.fontFamily};
}`;
    }).join('\n')}\n</style>`;
  }
  writeFileSync(appPath, appContent);
}


/**
 * mkdir before write file if dir does not exist
 * @param {string} filePath
 * @param {string|Buffer|TypedArray|DataView} content
 * @param {Object} options
 * @param {string} options.type - [type=file] 'file' or 'json'
 * @param {string} options.rootDir
 * @
 */
function writeFileWithDirCheck(filePath, content, { type = 'file', rootDir }) {
  const dirPath = dirname(filePath);
  // Although only write file to rootDir, it still need be compatible with old project
  if (!rootDir || dirPath.indexOf(rootDir) > -1) {
    if (!existsSync(dirPath)) {
      mkdirpSync(dirPath);
    }
    if (type === 'file') {
      writeFileSync(filePath, content);
    } else if (type === 'json') {
      writeJSONSync(filePath, content, { spaces: 2 });
    }
  }
}

module.exports = {
  output,
  transformCode
};
