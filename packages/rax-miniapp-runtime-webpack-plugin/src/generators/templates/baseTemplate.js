const platformConfig = require('../../platforms');
const addSingleQuote = require('../../utils/addSingleQuote');

function toDash(str) {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
}

/**
 * make kebab-case to camel case
 * @param {string} str
 * @param {boolean} big - use big camel or small camel case
 */
function toCamel(str, big = true) {
  let camel = '';
  let nextCap = big;
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== '-') {
      camel += nextCap ? str[i].toUpperCase() : str[i];
      nextCap = false;
    } else {
      nextCap = true;
    }
  }
  return camel;
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
    .map(a => a.indexOf(adapter.event) === 0 || a.indexOf(adapter.catchEvent) === 0 ? `${a}="${attrs[a]}"` : `${a}="{{${attrs[a]}}}"`)
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
  const componentName = toDash(nodeName);
  const attrs = { ...nodeAttributes };
  delete attrs.focus;

  return `
<template name="RAX_TMPL_${level}_${componentName}">
  <${componentName} id="{{r.id}}" data-private-node-id="{{r.nodeId}}" ${buildAttribute(attrs, adapter)} focus="{{r['focus-state'] === undefined ? false : r['focus-state']}}" />
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
  const { formatBindedData } = adapter;
  const { voidChildrenElements, voidElements, shouldNotGenerateTemplateComponents, needModifyChildrenComponents } = compSet;
  const componentName = toDash(nodeName); // Virtual components like h-element
  const componentActualName = toDash(nodeActualName); // Actual components like view
  const data = isRecursiveTemplate ? 'r: r.children' : `r: r.children, c: tool.d(c, '${componentName}')`;
  const templateNameExpression = isRecursiveTemplate ? 'RAX_TMPL_CHILDREN_0' : '{{tool.b(cid + 1)}}';
  let children = voidChildrenElements.has(nodeName)
    ? ''
    : `
    <template is="${templateNameExpression}" data="{{${formatBindedData(data)}}}" />
`;

  if (needModifyChildrenComponents[nodeName]) {
    children = needModifyChildrenComponents[nodeName](children, level);
  }

  let generateRes = child => `
<template name="RAX_TMPL_${level}_${componentName}">
  ${child}
</template>
`;

  if (voidElements.has(nodeName)) {
    return generateRes('');
  } else if (shouldNotGenerateTemplateComponents.has(nodeName)) {
    return '';
  } else {
    return generateRes(`<${componentActualName} ${buildAttribute(nodeAttributes, adapter)} id="{{r.id}}" data-private-node-id="{{r.nodeId}}">${children}</${componentActualName}>`);
  }
}


/**
 * Generate component props and events config for templates
 * @param {Object} components - component props and events original config
 * @param {Object} adapter - directive adapter for different miniapp platforms
 */
function createMiniComponents(components, derivedComponents, adapter) {
  const { supportSjs } = adapter;
  const result = Object.create(null);
  for (let compName in components) {
    let component = components[compName];
    const actualCompName = derivedComponents.get(compName) || compName;
    const newComp = Object.create(null);
    const { props = {}, events = {}, basicEvents = {} } = component;
    // Process props
    for (let prop in props) {
      let propValue = props[prop];
      if (propValue === '') {
        propValue = `r[${addSingleQuote(prop)}]`;
      } else if (isBooleanStringLiteral(propValue) || isNumber(+propValue)) {
        // Use sjs to process default value
        propValue = supportSjs ? `tool.a(r[${addSingleQuote(prop)}],${propValue})` : `r[${addSingleQuote(prop)}] === undefinded ? ${propValue} : r[${addSingleQuote(prop)}]`;
      } else {
        propValue = `r[${addSingleQuote(prop)}]||${propValue || addSingleQuote('')}`;
      }

      newComp[prop] = propValue;
    }
    // Process events
    for (let event in events) {
      const eventName = adapter.eventToLowerCase ? `${adapter.event}${event}`.toLocaleLowerCase() : `${adapter.event}${event}`;
      const eventValue = 'on' + actualCompName + event;
      newComp[eventName] = eventValue;
    }
    for (let basicEvent in basicEvents) {
      const isCatchComponent = compName.indexOf('Catch') === 0;
      const isTouchMoveEvent = basicEvent === 'TouchMove';

      const originalEventName = `${isCatchComponent && isTouchMoveEvent ? adapter.catchEvent : adapter.event}${basicEvent}`;
      const basicEventName = adapter.eventToLowerCase ? originalEventName.toLocaleLowerCase() : originalEventName;
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
 * @param {Object} customComponentsConfig - Configured by developer using build script plugin
 */
function modifyInternalComponents(internalComponents, customComponentsConfig) {
  const result = Object.assign({}, internalComponents);
  Object.keys(customComponentsConfig).forEach(comp => {
    const componentConfig = customComponentsConfig[comp];
    const { add: added = {}, 'delete': deleted = {}} = componentConfig;
    const { props = [], events = [] } = deleted;
    const { props: addedProps = [] } = added;
    const camelCasedCompName = toCamel(comp);
    if (result[camelCasedCompName]) {
      props.forEach(prop => delete result[camelCasedCompName].props[prop]);
      events.forEach(event => {
        if (result[camelCasedCompName].basicEvents && result[camelCasedCompName].basicEvents[event] !== undefined) {
          delete result[camelCasedCompName].basicEvents[event];
        } else if (result[camelCasedCompName].events && result[camelCasedCompName].events[event] !== undefined) {
          delete result[camelCasedCompName].events[event];
        }
      });
      addedProps.forEach(prop => {
        // Make sure the prop to be added doesn't exist at start
        if (!result[camelCasedCompName].props[prop]) {
          const defaultValue = prop.default === undefined ? '' : typeof prop.default === 'string' ? addSingleQuote(prop.default) : JSON.stringify(prop.default);
          result[camelCasedCompName].props[prop.name] = defaultValue;
        }
      });
    }
  });

  return result;
}

/**
 * Build root container and sjs import template
 * @param {Object} sjs - sjs config
 * @param {Object} options
 * @param {boolean} options.isRecursiveTemplate
 * @param {Object} options.adapter
 */
function buildBaseTemplate(sjs, { isRecursiveTemplate = true, adapter }) {
  const { formatBindedData, supportSjs } = adapter;
  const data = isRecursiveTemplate ? 'r: r' : "r: r, c: '', cid: -1";
  const recursiveTemplateNameExpression = supportSjs ? 'tool.c(r.nodeType)' : "'RAX_TMPL_0_' + r.nodeType";
  const templateNameExpression = isRecursiveTemplate ? recursiveTemplateNameExpression : "tool.c(r.nodeType, '')";
  return `${supportSjs ? buildSjsTemplate(sjs) : ''}

<template name="RAX_TMPL_ROOT_CONTAINER">
  <template is="{{${templateNameExpression}}}" data="{{${formatBindedData(data)}}}" />
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
  const { formatBindedData, supportSjs } = adapter;
  const data = isRecursiveTemplate ? 'r: item' : `r: item, c: c, cid: ${level}`;
  const recursiveTemplateNameExpression = supportSjs ? 'tool.c(item.nodeType)' : "'RAX_TMPL_0_' + item.nodeType";
  const templateNameExpression = isRecursiveTemplate ? recursiveTemplateNameExpression : 'tool.c(item.nodeType, c)';
  const template = restart ? '<element r="{{item}}" c="{{c}}" />' : `<template is="{{${templateNameExpression}}}" data="{{${formatBindedData(data)}}}" />`;
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
