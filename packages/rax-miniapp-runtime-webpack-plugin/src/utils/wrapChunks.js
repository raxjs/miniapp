const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');
const { RawSource, ConcatSource } = require('webpack-sources');
const { platformMap } = require('miniapp-builder-shared');
const { readFileSync } = require('fs-extra');
const { resolve } = require('path');
const adjustCSS = require('../utils/adjustCSS');
const { UNRECURSIVE_TEMPLATE_TYPE } = require('../constants');

const matchFile = (fileName, ext) =>
  ModuleFilenameHelpers.matchObject(
    { test: new RegExp(`\.${ext}$`) },
    fileName
  );

// Add content to chunks head and tail
module.exports = function(compilation, chunks, pluginDir, target) {
  const FunctionPolyfill = readFileSync(
    resolve(pluginDir, 'static', 'FunctionPolyfill.js'),
    'utf-8'
  );
  chunks.forEach((chunk) => {
    chunk.files.forEach((fileName) => {
      if (matchFile(fileName, 'js')) {
        // Page js
        const headerContent =
`module.exports = function(window, document) {const HTMLElement = window["HTMLElement"];${FunctionPolyfill}`;

        const footerContent = '}';

        compilation.assets[fileName] = new ConcatSource(
          headerContent,
          compilation.assets[fileName],
          footerContent
        );
      } else if (matchFile(fileName, 'css')) {
        compilation.assets[
          `${fileName}${platformMap[target].extension.css}`
        ] = new RawSource(
          adjustCSS(compilation.assets[fileName].source(), UNRECURSIVE_TEMPLATE_TYPE.has(target))
        );
      }
    });
  });
};
