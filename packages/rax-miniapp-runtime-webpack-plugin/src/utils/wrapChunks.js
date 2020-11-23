const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');
const { RawSource, ConcatSource } = require('webpack-sources');
const { readFileSync } = require('fs-extra');
const { resolve } = require('path');
const adjustCSS = require('../utils/adjustCSS');
const adapter = require('../adapter');
const { WECHAT_MINIPROGRAM } = require('../constants');

const matchFile = (fileName, ext) =>
  ModuleFilenameHelpers.matchObject(
    { test: new RegExp(`\.${ext}$`) },
    fileName
  );

// Add content to chunks head and tail
module.exports = function(compilation, chunks, rootDir, target) {
  const FunctionPolyfill = readFileSync(
    resolve(rootDir, 'templates', 'FunctionPolyfill.js.ejs'),
    'utf-8'
  );
  chunks.forEach((chunk) => {
    chunk.files.forEach((fileName) => {
      if (matchFile(fileName, 'js')) {
        // Page js
        const headerContent =
          `${FunctionPolyfill}
          module.exports = function(window, document) {const HTMLElement = window["HTMLElement"];`;

        const footerContent = '}';

        compilation.assets[fileName] = new ConcatSource(
          headerContent,
          compilation.assets[fileName],
          footerContent
        );
      } else if (matchFile(fileName, 'css')) {
        compilation.assets[
          `${fileName}.${adapter[target].css}`
        ] = new RawSource(
          adjustCSS(compilation.assets[fileName].source(), target === WECHAT_MINIPROGRAM)
        );
      }
    });
  });
};
