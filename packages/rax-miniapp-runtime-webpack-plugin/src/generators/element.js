const { join } = require('path');
const { platformMap } = require('miniapp-builder-shared');

const platformConfig = require('../platforms');
const { RECURSIVE_TEMPLATE_TYPE, UNRECURSIVE_TEMPLATE_TYPE } = require('../constants');

const addFileToCompilation = require('../utils/addFileToCompilation');
const getAssetPath = require('../utils/getAssetPath');
const isNpmModule = require('../utils/isNpmModule');
const rmCurDirPathSymbol = require('../utils/rmCurDirPathSymbol');
const { generateRootTmpl } = require('./root');
const { buildTemplate, buildNativeComponentTemplate, buildSjs } = require('./templates');


function generateElementJS(compilation, { target, command, subAppRoot = '' }) {
  const filename = join(subAppRoot, 'comp.js');
  addFileToCompilation(compilation, {
    filename,
    content:
`const render = require('${getAssetPath('render.js', filename)}');

Component(render.createElementConfig());`,
    target,
    command,
  });
}

function generateElementTemplate(compilation,
  { usingPlugins, usingComponents, target, command, subAppRoot = '', modifyTemplate }) {
  const { adapter: { formatBindedData } } = platformConfig[target];
  let content = `
<template is="RAX_TMPL_ROOT_CONTAINER" data="{{${formatBindedData('r: r')}}}" />`;

  const isRecursiveTemplate = RECURSIVE_TEMPLATE_TYPE.has(target);
  if (!isRecursiveTemplate) {
    generateRootTmpl(compilation, { usingPlugins, usingComponents, target, command, modifyTemplate, subAppRoot });
    content = `<import src="./root${platformMap[target].extension.xml}"/>` + content;
  } else {
    const sjs = buildSjs(target);
    addFileToCompilation(compilation, {
      filename: join(subAppRoot, `tool${platformMap[target].extension.script}`),
      content: sjs,
      target,
      command,
    });

    const template = buildTemplate(target, modifyTemplate, { isRecursiveTemplate });
    const nativeComponentTemplate = buildNativeComponentTemplate(usingPlugins, target, isRecursiveTemplate) + buildNativeComponentTemplate(usingComponents, target, isRecursiveTemplate);

    // In recursiveTemplate, root.axml need be written into comp.axml
    content = template + nativeComponentTemplate + content;
  }
  addFileToCompilation(compilation, {
    filename: join(subAppRoot, `comp${platformMap[target].extension.xml}`),
    content,
    target,
    command,
  });
}

function generateElementJSON(compilation, { usingComponents, usingPlugins, target, command, subAppRoot = '' }) {
  const content = {
    component: true,
    usingComponents: {}
  };

  if (UNRECURSIVE_TEMPLATE_TYPE.has(target)) {
    content.usingComponents.element = './comp';
  }
  Object.keys(usingComponents).forEach(component => {
    const componentPath = usingComponents[component].path;
    content.usingComponents[component] = isNpmModule(componentPath) ? componentPath : getAssetPath(rmCurDirPathSymbol(componentPath), join(subAppRoot, 'comp'));
  });
  Object.keys(usingPlugins).forEach(plugin => {
    content.usingComponents[plugin] = usingPlugins[plugin].path;
  });

  addFileToCompilation(compilation, {
    filename: join(subAppRoot, 'comp.json'),
    content: JSON.stringify(content, null, 2),
    target,
    command,
  });
}

module.exports = {
  generateElementTemplate,
  generateElementJS,
  generateElementJSON
};
