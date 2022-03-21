const { platformMap } = require('miniapp-builder-shared');

const addFileToCompilation = require('../utils/addFileToCompilation');
const { buildTemplate, buildSjs, buildNativeComponentTemplate } = require('./templates');

function generateRootTmpl(
  compilation,
  { usingPlugins, usingComponents, target, modifyTemplate, subAppRoot = '' }
) {
  const template = buildTemplate(target, modifyTemplate);
  const sjs = buildSjs(target);
  const nativeComponentTemplate = buildNativeComponentTemplate(usingPlugins, target) + buildNativeComponentTemplate(usingComponents, target);

  addFileToCompilation(compilation, {
    filename: `${subAppRoot}/root${platformMap[target].extension.xml}`,
    content: template + nativeComponentTemplate,
    target,
  });
  addFileToCompilation(compilation, {
    filename: `${subAppRoot}/tool${platformMap[target].extension.script}`,
    content: sjs,
    target,
  });
}

module.exports = {
  generateRootTmpl
};
