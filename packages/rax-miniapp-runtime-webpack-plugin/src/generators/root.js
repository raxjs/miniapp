const { platformMap } = require('miniapp-builder-shared');

const addFileToCompilation = require('../utils/addFileToCompilation');
const { buildTemplate, buildSjs, buildNativeComponentTemplate } = require('./templates');


const RECURSIVE_TEMPLATE_TYPE = ['miniapp'];

function generateRootTmpl(
  compilation,
  { usingPlugins, usingComponents, target, command, modifyTemplate }
) {
  const isRecursiveTemplate = RECURSIVE_TEMPLATE_TYPE.indexOf(target) > -1;
  const template = buildTemplate(target, modifyTemplate, { isRecursiveTemplate });
  const sjs = buildSjs(target, { isRecursiveTemplate });
  const nativeComponentTemplate = buildNativeComponentTemplate(usingPlugins, target, isRecursiveTemplate) + buildNativeComponentTemplate(usingComponents, target, isRecursiveTemplate);

  addFileToCompilation(compilation, {
    filename: `root${platformMap[target].extension.xml}`,
    content: template + nativeComponentTemplate,
    target, command
  });
  addFileToCompilation(compilation, {
    filename: `tool${platformMap[target].extension.script}`,
    content: sjs,
    target,
    command,
  });
}

module.exports = {
  generateRootTmpl
};
