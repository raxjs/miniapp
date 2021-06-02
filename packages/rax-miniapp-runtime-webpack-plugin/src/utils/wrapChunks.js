const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');
const { RawSource, ConcatSource } = require('webpack-sources');
const { platformMap } = require('miniapp-builder-shared');
const adjustCSS = require('../utils/adjustCSS');
const { UNRECURSIVE_TEMPLATE_TYPE } = require('../constants');

const matchFile = (fileName, ext) =>
  ModuleFilenameHelpers.matchObject(
    { test: new RegExp(`\.${ext}$`) },
    fileName
  );

const FunctionPolyfill = 'Function||(Function=function(){return function(){return Symbol}}),void 0===Function.prototype.call&&(Function.prototype.call=function(n){(n=n||window).fn=this;const t=[...arguments].slice(1),o=n.fn(...t);return delete n.fn,o}),void 0===Function.prototype.apply&&(Function.prototype.apply=function(n){let t;return(n=n||window).fn=this,t=arguments[1]?n.fn(...arguments[1]):n.fn(),delete n.fn,t})';

// Add content to chunks head and tail
module.exports = function(compilation, chunks, target) {
  chunks.forEach((chunk) => {
    chunk.files.forEach((fileName) => {
      if (matchFile(fileName, 'js')) {
        // Page js
        const headerContent =
`${FunctionPolyfill}
module.exports = function(window, document) {
  const HTMLElement = window["HTMLElement"];
  const documentModifyCallbacks = getApp().__documentModifyCallbacks;
  if (Array.isArray(documentModifyCallbacks)) {
    documentModifyCallbacks.push((val) => {
      document = val;
    });
  }
`;

        const footerContent = '}';

        compilation.assets[fileName] = new ConcatSource(
          headerContent,
          compilation.assets[fileName],
          footerContent
        );
      } else if (matchFile(fileName, 'css') && platformMap[target].extension.css !== '.css') {
        compilation.assets[
          `${fileName}${platformMap[target].extension.css}`
        ] = new RawSource(
          adjustCSS(compilation.assets[fileName].source(), UNRECURSIVE_TEMPLATE_TYPE.has(target))
        );
      }
    });
  });
};
