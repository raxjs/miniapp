const platformConfig = require('../../platforms');
const addSingleQuote = require('../../utils/addSingleQuote');

function toDash(str) {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
}

function isNumber(o) {
  return typeof o === 'number' && !isNaN(o);
}

function isBooleanStringLiteral(o) {
  return o === 'true' || o === 'false';
}

/**
 * Build sjs import template
 * @param {Object} sjsConfig
 * @param {string} sjsConfig.tag
 * @param {string} sjsConfig.extension
 * @param {string} sjsConfig.name
 * @param {string} sjsConfig.from

 */
function buildSjsTemplate({ tag, extension, name, from }) {
  return `<${tag} ${name}="tool" ${from}="./tool.${extension}" />`;
}

/**
 * Build attributes in component template
 * @param {Object} attrs
 * @param {Object} adapter - directive adapter for different miniapp platforms
 */
function buildAttribute(attrs, adapter) {
  return Object.keys(attrs)
    .map(a => a.indexOf(adapter.event) === 0 ? `${a}="${attrs[a]}"` : `${a}="{{${attrs[a]}}}"`)
    .join(' ');
}

/**
 * Build components with focus props
 * @param {Object} compInfo
 * @param {number} level - recursion level
 * @param {Object} adapter
 */
function buildFocusComponentTemplate(compInfo, level, adapter) {
  const { nodeName, nodeAttributes } = compInfo;
  const attrs = { ...nodeAttributes };
  const templateName = `tool.b(r, 'RAX_TMPL_${level}_')`;
  delete attrs.focus;

  return `
<template name="RAX_TMPL_${level}_${nodeName}">
  <template is="{{${templateName}}} data={{r: r}}" />
</template>

<template name="RAX_TMPL_${level}_${nodeName}_focus">
  <${nodeName} id="{{r.id}}" data-private-node-id="{{r.nodeId}}" ${buildAttribute(nodeAttributes, adapter)} />
</template>

<template name="RAX_TMPL_${level}_${nodeName}_blur">
  <${nodeName} id="{{r.id}}" data-private-node-id="{{r.nodeId}}" ${buildAttribute(attrs, adapter)} />
</template>
`;
}

/**
 * Build standard component template
 * @param {Object} compInfo
 * @param {number} level - recursion level
 * @param {Object} adapter
 * @param {Object} compSet - special component sets
 * @param {Object} options
 * @param {boolean} options.isRecursiveTemplate
 */
function buildStandardComponentTemplate(compInfo, level, adapter, compSet, { isRecursiveTemplate }) {
  const { nodeName, nodeAttributes, nodeActualName } = compInfo;
  const { voidChildrenElements, voidElements, shouldNotGenerateTemplateComponents, needModifyChildrenComponents } = compSet;
  const data = isRecursiveTemplate ? 'r: r.children' : `r: r.children, c: tool.e(c, '${nodeName}'), cid: ${level}`;
  let children = voidChildrenElements.has(nodeName)
    ? ''
    : `
    <template is="{{tool.c(cid + 1)}}" data="{{${data}}}" />
`;

  if (needModifyChildrenComponents[nodeName]) {
    children = needModifyChildrenComponents[nodeName](children, level);
  }

  let generateRes = child => `
<template name="RAX_TMPL_${level}_${nodeName}">
  ${child}
</template>
`;

  if (voidElements.has(nodeName)) {
    return generateRes('');
  } else if (shouldNotGenerateTemplateComponents.has(nodeName)) {
    return '';
  } else {
    return generateRes(`<${nodeActualName} ${buildAttribute(nodeAttributes, adapter)} id="{{r.id}}" data-private-node-id="{{r.nodeId}}">${children}</${nodeActualName}>`);
  }
}


/**
 * Generate component props and events config for templates
 * @param {Object} components - component props and events original config
 * @param {Object} adapter - directive adapter for different miniapp platforms
 */
function createMiniComponents(components, adapter) {
  const result = Object.create(null);
  for (let key in components) {
    let component = components[key];
    const compName = toDash(key);
    const newComp = Object.create(null);
    const { props = {}, events = {}, basicEvents = {} } = component;
    // Process props
    for (let prop in props) {
      let propValue = props[prop];
      if (propValue === '') {
        propValue = `r[${addSingleQuote(prop)}]`;
      } else if (isBooleanStringLiteral(propValue) || isNumber(+propValue)) {
        // Use sjs to process default value
        propValue = `tool.a(r[${addSingleQuote(prop)}],${propValue})`;
      } else {
        propValue = `r[${addSingleQuote(prop)}]||${propValue || addSingleQuote('')}`;
      }

      newComp[prop] = propValue;
    }
    // Process events
    for (let event in events) {
      const eventName = adapter.eventToLowerCase ? `${adapter.event}${event}`.toLocaleLowerCase() : `${adapter.event}${event}`;
      const eventValue = 'on' + key + event;
      newComp[eventName] = eventValue;
    }

    for (let basicEvent in basicEvents) {
      const basicEventName = adapter.eventToLowerCase ? `${adapter.event}${basicEvent}`.toLocaleLowerCase() : `${adapter.event}${basicEvent}`;
      newComp[basicEventName] = 'on' + basicEvent;
    }

    // Add style props
    Object.assign(newComp, {
      style: 'r.style',
      class: 'r.class'
    });

    result[compName] = newComp;
  }

  return result;
}

/**
 * Apply the custom component config
 * @param {Object} internalComponents
 * @param {Object} customComponentsConfig - Configed by developer using build script plugin
 */
function modifyInternalComponents(internalComponents, customComponentsConfig) {
  const result = Object.assign({}, internalComponents);
  Object.keys(customComponentsConfig).forEach(comp => {
    const componentConfig = customComponentsConfig[comp];
    const { deleted: { props = [], events = [], basicEvents = []} } = componentConfig; // Only support deleting temporarily
    if (result[comp]) {
      props.forEach(prop => delete result[comp].props[prop]);
      events.forEach(event => delete result[comp].events[event]);
      basicEvents.forEach(basicEvent => delete result[comp].basicEvents[basicEvent]);
    }
  });

  return result;
}

/**
 * Build root container and sjs import template
 * @param {Object} sjs - sjs config
 * @param {Object} options
 * @param {boolean} options.isRecursiveTemplate
 */
function buildBaseTemplate(sjs, { isRecursiveTemplate = true }) {
  const data = isRecursiveTemplate ? 'r: r' : "r: r, c: '', cid: -1";
  return `${buildSjsTemplate(sjs)}

<template name="RAX_TMPL_ROOT_CONTAINER">
  <template is="{{tool.d(r.nodeType, '')}}" data="{{${data}}}" />
</template>
`;
}

/**
 * Build children template
 * @param {number} level - recursion level
 * @param {Object} adapter
 * @param {Object} options
 * @param {boolean} options.isRecursiveTemplate
 * @param {boolean} options.restart - Use custom component to restart the recursive template
 */
function buildChildrenTemplate(level, adapter, { isRecursiveTemplate = true, restart = false }) {
  const data = isRecursiveTemplate ? 'r: item' : 'r: item, c: c, cid: cid + 1';
  const template = restart ? '<element r="{{item}}" c="{{c}}" />' : `<template is="{{tool.d(item.nodeType, c)}}" data="{{${data}}}" />`;
  return `
<template name="RAX_TMPL_CHILDREN_${level}">
  <block ${adapter.for}="{{r}}" ${adapter.key}="nodeId">
    <block ${adapter.if}="{{item.nodeId}}">
      ${template}
    </block>
    <block ${adapter.else}>
      <block>{{item.content}}</block>
    </block>
  </block>
</template>
`;
}

/**
 * Build component template
 * @param {Object} compInfo
 * @param {number} level - recursion level
 * @param {string} target
 * @param {Object} options
 * @param {boolean} options.isRecursiveTemplate
 */
function buildComponentTemplate(compInfo, level, target, { isRecursiveTemplate = true }) {
  const { nodeName } = compInfo;
  const { focusComponents, voidChildrenElements, voidElements, shouldNotGenerateTemplateComponents, needModifyChildrenComponents, adapter } = platformConfig[target];
  return focusComponents.has(nodeName) ? buildFocusComponentTemplate(compInfo, level, adapter) : buildStandardComponentTemplate(compInfo, level, adapter, { voidChildrenElements, voidElements, shouldNotGenerateTemplateComponents, needModifyChildrenComponents }, { isRecursiveTemplate });
}

module.exports = {
  createMiniComponents,
  modifyInternalComponents,
  buildBaseTemplate,
  buildChildrenTemplate,
  buildComponentTemplate
};
