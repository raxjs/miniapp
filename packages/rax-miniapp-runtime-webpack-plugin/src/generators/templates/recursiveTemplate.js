const { createMiniComponents, modifyInternalComponents, buildBaseTemplate, buildChildrenTemplate, buildComponentTemplate } = require('./baseTemplate');

const platformConfig = require('../../platforms');

/**
 * Build recursive template
 * @param {string} target
 * @param {Object} customComponentsConfig - Configed by developer using build script plugin
 */
function buildRecursiveTemplate(target, customComponentsConfig) {
  const { internalComponents, derivedComponents, sjs, adapter } = platformConfig[target];

  let template = buildBaseTemplate(sjs, {});
  template += buildChildrenTemplate(0, adapter, {});

  const customInternalComponents = modifyInternalComponents(internalComponents, customComponentsConfig);
  const miniComponents = createMiniComponents(customInternalComponents, adapter);
  const components = Object.keys(miniComponents);

  template = components.reduce((current, nodeName) => {
    const nodeAttributes = miniComponents[nodeName];
    const nodeActualName = derivedComponents.get(nodeName) || nodeName;
    return current + buildComponentTemplate({ nodeName, nodeAttributes, nodeActualName }, 0, target, {});
  }, template);

  return template;
}

/**
 * Build recursive template sjs
 * @param {string} target
 */
function buildRecursiveTemplateSjs(target) {
  const { sjs: { exportExpression }} = platformConfig[target];
  return `${exportExpression} {
      a: function(v, dv) {
        return v === undefined ? dv : v;
      },
      b: function(level) {
        return 'RAX_TMPL_CHILDREN_' + level;
      },
      c: function(nodeType) {
        if (!nodeType) nodeType = 'h-element';
        var templateName = 'RAX_TMPL_0_' + nodeType;
        return templateName;
      }
}`;
}


module.exports = {
  buildRecursiveTemplate,
  buildRecursiveTemplateSjs
};
