const ejs = require('ejs');
const { MINIAPP } = require('../constants');
const adapter = require('../adapter');
const addFileToCompilation = require('../utils/addFileToCompilation');
const getTemplate = require('../utils/getTemplate');
const { generateRootTmpl } = require('./root');

function generateElementJS(compilation,
  { target, command }) {
  addFileToCompilation(compilation, {
    filename: 'comp.js',
    content: `const render = require('./render');

    Component(render.createElementConfig());`,
    target,
    command,
  });
}

function generateElementTemplate(compilation,
  { usingPlugins, usingComponents, target, command, pluginDir }) {
  let content = '<template is="{{r.nodeType || \'h-element\'}}" data="{{r: r}}" />';
  if (target !== MINIAPP) {
    generateRootTmpl(compilation, { usingPlugins, usingComponents, target, command, pluginDir });
    content = `<import src="./root.${adapter[target].xml}"/>` + content;
  } else {
    const pluginTmpl = ejs.render(getTemplate(pluginDir, 'plugin.xml', target), {
      usingPlugins
    });
    const componentTmpl = ejs.render(getTemplate(pluginDir, 'custom-component.xml', target), {
      usingComponents
    });
    // In MiniApp, root.axml need be written into comp.axml
    content = ejs.render(getTemplate(pluginDir, 'root.xml', target))
    + pluginTmpl
    + componentTmpl
    + content;
  }
  addFileToCompilation(compilation, {
    filename: `comp.${adapter[target].xml}`,
    content,
    target,
    command,
  });
  addFileToCompilation(compilation, {
    filename: `tool.${adapter[target].script}`,
    content: ejs.render(getTemplate(pluginDir, `tool.${adapter[target].script}`, target)),
    target,
    command,
  });
}

function generateElementJSON(compilation, { usingComponents, usingPlugins, target, command }) {
  const content = {
    component: true,
    usingComponents: {}
  };

  if (target !== MINIAPP) {
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
