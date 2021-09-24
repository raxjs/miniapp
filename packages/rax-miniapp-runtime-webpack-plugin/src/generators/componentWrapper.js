/**
 * generate ComponentWrapper
*/
const { join } = require('path');
const { platformMap, componentWrapper: { WrapperElement } } = require('miniapp-builder-shared');

const platformConfig = require('../platforms');
const { RECURSIVE_TEMPLATE_TYPE, UNRECURSIVE_TEMPLATE_TYPE } = require('../constants');

const addFileToCompilation = require('../utils/addFileToCompilation');
const getAssetPath = require('../utils/getAssetPath');
const isNpmModule = require('../utils/isNpmModule');
const rmCurDirPathSymbol = require('../utils/rmCurDirPathSymbol');
const { generateRootTmpl } = require('./root');
const { buildTemplate, buildNativeComponentTemplate, buildSjs } = require('./templates');

function ensureWrapperFolder() {

}

function generateWrapperJS(compilation, { target, command, subAppRoot = '' }) {
  const filename = join(subAppRoot, 'wrapper.js');
  addFileToCompilation(compilation, {
    filename,
    content:
`const render = require('${getAssetPath('render.js', filename)}');

Component(render.createElementConfig());`,
    target,
    command,
  });
}

function generateWrapperTemplate(compilation,
  { target, command, subAppRoot = '' }) {
  const { adapter: { formatBindedData, for: targetFor, key } } = platformConfig[target];

  let content = `
<block ${targetFor}="{{r.children}}" ${key}="nodeId">
  <template is="RAX_TMPL_ROOT_CONTAINER" data="{{${formatBindedData('r: item')}}}"></template>
</block>`;

  const isRecursiveTemplate = RECURSIVE_TEMPLATE_TYPE.has(target);
  if (!isRecursiveTemplate) {
    content = `<import src="./root${platformMap[target].extension.xml}"/>` + content;
  } else {
    content = `<import src="./comp${platformMap[target].extension.xml}"/>` + content;
  }

  addFileToCompilation(compilation, {
    filename: join(subAppRoot, `wrapper${platformMap[target].extension.xml}`),
    content,
    target,
    command
  });
}

function generateWrapperJSON(compilation, { usingComponents, usingPlugins, target, command, subAppRoot = '' }) {
  const content = {
    component: true,
    usingComponents: {
      [WrapperElement]: './wrapper'
    }
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
    filename: join(subAppRoot, 'wrapper.json'),
    content: JSON.stringify(content, null, 2),
    target,
    command,
  });
}


module.exports = {
  ensureWrapperFolder,
  generateWrapperJS,
  generateWrapperTemplate,
  generateWrapperJSON,
};
