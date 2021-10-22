// eslint-disable-next-line import/no-extraneous-dependencies
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');
const webpackSources = require('webpack-sources');
const { platformMap } = require('miniapp-builder-shared');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const { emitAsset } = require('@builder/compat-webpack4');
const adjustCSS = require('./adjustCSS');
const addFileToCompilation = require('./addFileToCompilation');
const { NEED_REPLACE_ROOT_TARGET } = require('../constants');

const matchFile = (fileName, ext) =>
  ModuleFilenameHelpers.matchObject(
    { test: new RegExp(`\.${ext}$`) },
    fileName
  );

const FunctionPolyfill = 'Function||(Function=function(){return function(){return Symbol}}),void 0===Function.prototype.call&&(Function.prototype.call=function(n){(n=n||window).fn=this;const t=[...arguments].slice(1),o=n.fn(...t);return delete n.fn,o}),void 0===Function.prototype.apply&&(Function.prototype.apply=function(n){let t;return(n=n||window).fn=this,t=arguments[1]?n.fn(...arguments[1]):n.fn(),delete n.fn,t})';

// Add content to chunks head and tail
module.exports = function(compilation, assets, { command, target }) {
  const { ConcatSource } = webpack.sources || webpackSources;
  Object.keys(assets).forEach((fileName) => {
    if (matchFile(fileName, 'js')) {
      // Page js
      const headerContent =
`${FunctionPolyfill}
module.exports = function(window, document, app) {
const self = window;
const HTMLElement = window["HTMLElement"];
if (typeof getApp === 'function') {
  const documentModifyCallbacks = (getApp() || app).__documentModifyCallbacks;
  if (Array.isArray(documentModifyCallbacks)) {
    documentModifyCallbacks.push((val) => {
      document = val;
    });
  }
}
`;

      const footerContent = '\n}';
      const content = compilation.assets[fileName].source();
      // Delete original asset
      delete compilation.assets[fileName];
      // Add wrapped asset
      emitAsset(compilation, fileName, new ConcatSource(
        headerContent,
        content,
        footerContent
      ));
    } else if (matchFile(fileName, 'css') && platformMap[target].extension.css !== '.css') {
      const content = compilation.assets[fileName].source();
      // Delete original asset
      delete compilation.assets[fileName];
      // Add new css file
      addFileToCompilation(compilation, {
        filename: `${fileName}${platformMap[target].extension.css}`,
        content: adjustCSS(content, NEED_REPLACE_ROOT_TARGET.has(target)),
        command,
        target,
        needMinify: false,
      });
    }
  });
};
