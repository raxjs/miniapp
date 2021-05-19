const { join } = require('path');
const { platformMap, pathHelper: { getBundlePath }} = require('miniapp-builder-shared');

const platformConfig = require('../platforms');
const getAssetPath = require('../utils/getAssetPath');
const getSepProcessedPath = require('../utils/getSepProcessedPath');
const addFileToCompilation = require('../utils/addFileToCompilation');
const isNpmModule = require('../utils/isNpmModule');
const rmCurDirPathSymbol = require('../utils/rmCurDirPathSymbol');
const { RECURSIVE_TEMPLATE_TYPE } = require('../constants');

function generatePageCSS(
  compilation,
  pageRoute,
  subAppRoot = '',
  { target, command }
) {
  let pageCssContent = '/* required by usingComponents */\n';
  const pageCssPath = `${pageRoute}${platformMap[target].extension.css}`;
  const isCssExtension = platformMap[target].extension.css === '.css';
  const subAppCssPath = `${getBundlePath(subAppRoot)}.css${isCssExtension ? '' : platformMap[target].extension.css}`;
  if (compilation.assets[subAppCssPath]) {
    pageCssContent += `@import "${getAssetPath(subAppCssPath, pageCssPath)}";`;
  }


  addFileToCompilation(compilation, {
    filename: pageCssPath,
    content: pageCssContent,
    target,
    command,
  });
}

function generatePageJS(
  compilation,
  pageRoute,
  pagePath,
  nativeLifeCyclesMap = {},
  commonPageJSFilePaths = [],
  subAppRoot = '',
  { target, command }
) {
  const renderPath = getAssetPath('render', pageRoute);
  const route = getSepProcessedPath(pagePath);
  const nativeLifeCycles = `[${Object.keys(nativeLifeCyclesMap).reduce((total, current, index) => index === 0 ? `${total}'${current}'` : `${total},'${current}'`, '')}]`;
  const requirePageBundle = commonPageJSFilePaths.reduce((prev, filePath) => {
    if (filePath === 'webpack-runtime.js') return prev;
    return `${prev}require('${getAssetPath(filePath, pageRoute)}')(window, document);`;
  }, '');
  const init = `
function init(window, document) {${requirePageBundle}}`;

  const pageJsContent = `
const render = require('${renderPath}');
${init}
Page(render.createPageConfig('${route}', ${nativeLifeCycles}, init, '${subAppRoot}'))`;

  addFileToCompilation(compilation, {
    filename: `${pageRoute}.js`,
    content: pageJsContent,
    target,
    command,
  });
}

function generatePageXML(
  compilation,
  pageRoute,
  useComponent,
  { target, command, subAppRoot = '' }
) {
  const { adapter: { formatBindedData } } = platformConfig[target];

  let pageXmlContent;
  if (RECURSIVE_TEMPLATE_TYPE.has(target) && useComponent) {
    pageXmlContent = '<element r="{{root}}"  />';
  } else {
    const rootTmplFileName = join(subAppRoot, `root${platformMap[target].extension.xml}`);
    const pageTmplFilePath = `${pageRoute}${platformMap[target].extension.xml}`;
    pageXmlContent = `<import src="${getAssetPath(rootTmplFileName, pageTmplFilePath)}"/>
<template is="RAX_TMPL_ROOT_CONTAINER" data="{{${formatBindedData('r: root')}}}"  />`;
  }

  addFileToCompilation(compilation, {
    filename: `${pageRoute}${platformMap[target].extension.xml}`,
    content: pageXmlContent,
    target,
    command,
  });
}

function generatePageJSON(
  compilation,
  pageConfig,
  useComponent,
  usingComponents, usingPlugins,
  pageRoute,
  { target, command, subAppRoot = '' }
) {
  if (!pageConfig.usingComponents) {
    pageConfig.usingComponents = {};
  }

  if (useComponent || !RECURSIVE_TEMPLATE_TYPE.has(target)) {
    pageConfig.usingComponents.element = getAssetPath(join(subAppRoot, 'comp'), pageRoute);
  }

  Object.keys(usingComponents).forEach(component => {
    const componentPath = usingComponents[component].path;
    pageConfig.usingComponents[component] = isNpmModule(componentPath) ? componentPath : getAssetPath(rmCurDirPathSymbol(componentPath), pageRoute);
  });
  Object.keys(usingPlugins).forEach(plugin => {
    pageConfig.usingComponents[plugin] = usingPlugins[plugin].path;
  });

  addFileToCompilation(compilation, {
    filename: `${pageRoute}.json`,
    content: JSON.stringify(pageConfig, null, 2),
    target,
    command,
  });
}

module.exports = {
  generatePageCSS,
  generatePageJS,
  generatePageJSON,
  generatePageXML
};
