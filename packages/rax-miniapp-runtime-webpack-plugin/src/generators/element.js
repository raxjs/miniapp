const { platformMap } = require('miniapp-builder-shared');

const { RECURSIVE_TEMPLATE_TYPE, UNRECURSIVE_TEMPLATE_TYPE } = require('../constants');

const addFileToCompilation = require('../utils/addFileToCompilation');
const { generateRootTmpl } = require('./root');
const { buildTemplate, buildNativeComponentTemplate, buildSjs } = require('./templates');


function generateElementJS(compilation,
  { target, command }) {
  addFileToCompilation(compilation, {
    filename: 'comp.js',
    content:
`const render = require('./render');

Component(render.createElementConfig());`,
    target,
    command,
  });
}

function generateElementTemplate(compilation,
  { usingPlugins, usingComponents, target, command, pluginDir, modifyTemplate }) {
  let content = `
<template is="RAX_TMPL_ROOT_CONTAINER" data="{{r: r}}" />`;

  const isRecursiveTemplate = RECURSIVE_TEMPLATE_TYPE.has(target);
  if (!isRecursiveTemplate) {
    generateRootTmpl(compilation, { usingPlugins, usingComponents, target, command, pluginDir, modifyTemplate });
    content = `<import src="./root${platformMap[target].extension.xml}"/>` + content;
  } else {
    const sjs = buildSjs(target);
    addFileToCompilation(compilation, {
      filename: `tool${platformMap[target].extension.script}`,
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
    filename: `comp${platformMap[target].extension.xml}`,
    content,
    target,
    command,
  });
}

function generateElementJSON(compilation, { usingComponents, usingPlugins, target, command }) {
  const content = {
    component: true,
    usingComponents: {}
  };

  if (UNRECURSIVE_TEMPLATE_TYPE.has(target)) {
    content.usingComponents.element = './comp';
  }
  Object.keys(usingComponents).forEach(component => {
    content.usingComponents[component] = usingComponents[component].path;
  });
  Object.keys(usingPlugins).forEach(plugin => {
    content.usingComponents[plugin] = usingPlugins[plugin].path;
  });

  addFileToCompilation(compilation, {
    filename: 'comp.json',
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
