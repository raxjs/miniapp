const platformConfig = require('../../platforms');
const { buildRecursiveTemplate, buildRecursiveTemplateSjs } = require('./recursiveTemplate');
const { buildUnrecursiveTemplate, buildUnrecursiveTemplateSjs } = require('./unrecursiveTemplate');
const { RECURSIVE_TEMPLATE_TYPE } = require('../../constants');

/**
 * Build template
 * @param {string} target
 * @param {Object} modifyTemplate - Custom component config from build.json
 */
function buildTemplate(target, modifyTemplate) {
  const isRecursiveTemplate = RECURSIVE_TEMPLATE_TYPE.has(target);
  let customComponentConfig = modifyTemplate;
  const template = isRecursiveTemplate ? buildRecursiveTemplate(target, customComponentConfig) : buildUnrecursiveTemplate(target, customComponentConfig);
  return template;
}

/**
 * Build sjs
 * @param {string} target
 */
function buildSjs(target) {
  const isRecursiveTemplate = RECURSIVE_TEMPLATE_TYPE.has(target);
  const sjs = isRecursiveTemplate ? buildRecursiveTemplateSjs(target) : buildUnrecursiveTemplateSjs(target);
  return sjs;
}

function buildNativeComponentTemplate(usings, target) {
  const isRecursiveTemplate = RECURSIVE_TEMPLATE_TYPE.has(target);
  const { adapter } = platformConfig[target];
  const { formatBindedData, supportSjs } = adapter;

  return Object.keys(usings).reduce((current, componentTag) => {
    const props = usings[componentTag].props.reduce((cur, prop) => {
      const tmpl = ` ${prop}="{{r['${prop}']}}"`;
      return cur + tmpl;
    }, '');
    const events = usings[componentTag].events.reduce((cur, event) => {
      const tmpl = ` ${adapter.event}${event}="{{r['${event}']}}"`;
      return cur + tmpl;
    }, '');
    const templateNameExpression = supportSjs ? '{{tool.c(item.nodeType)}}' : "'RAX_TMPL_0' + item.nodeType";
    const elementTemplate = isRecursiveTemplate ? `<template is="${templateNameExpression}" data="{{${formatBindedData('r: item')}}}" />` : '<element r="{{item}}" />';
    const template = `
<template name="RAX_TMPL_0_${componentTag}">
  <${componentTag}
    data-private-node-id="{{r.nodeId}}" data-private-page-id="{{r.pageId}}" ${props} ${events}
  >
    <block ${adapter.for}="{{r.children}}" ${adapter.key}="nodeId">
      <block ${adapter.if}="{{item['slot']}}">
        <view slot="{{item['slot']}}">
          ${elementTemplate}
        </view>
      </block>
      <block ${adapter.else}>
        <block ${adapter.if}="{{item.nodeId}}">
          ${elementTemplate}
        </block>
        <block ${adapter.else}>
          <block>{{item.content}}</block>
        </block>
      </block>
    </block>
  </${componentTag}>
</template>
    `;
    return current + template;
  }, '');
}

module.exports = {
  buildTemplate,
  buildSjs,
  buildNativeComponentTemplate
};
