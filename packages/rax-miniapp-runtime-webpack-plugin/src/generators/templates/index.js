const platformConfig = require('../../platforms');
const { buildRecursiveTemplate, buildRecursiveTemplateSjs } = require('./recursiveTemplate');
const { buildUnrecursiveTemplate, buildUnrecursiveTemplateSjs } = require('./unrecursiveTemplate');

/**
 * Build template
 * @param {string} target
 * @param {Object} api - build scripts api
 * @param {Object} options
 * @param {boolean} options.isRecursiveTemplate
 */
function buildTemplate(target, api, { isRecursiveTemplate = true }) {
  let customComponentConfig = api.hasMethod('modifyTemplate') ? api.applyMethod('modifyTemplate', target) : {};
  const template = isRecursiveTemplate ? buildRecursiveTemplate(target, customComponentConfig) : buildUnrecursiveTemplate(target, customComponentConfig);
  return template;
}

/**
 * Build sjs
 * @param {string} target
 * @param {Object} options
 * @param {boolean} options.isRecursiveTemplate
 */
function buildSjs(target, { isRecursiveTemplate = true }) {
  const sjs = isRecursiveTemplate ? buildRecursiveTemplateSjs(target) : buildUnrecursiveTemplateSjs(target);
  return sjs;
}

function buildNativeComponentTemplate(usings, target) {
  const { adapter } = platformConfig[target];

  return Object.keys(usings).reduce((current, componentTag) => {
    const props = usings[componentTag].props.reduce((cur, prop) => {
      const tmpl = `${prop}="{{r['${prop}']}}"`;
      return cur + tmpl;
    }, '');
    const events = usings[componentTag].events.reduce((cur, event) => {
      const tmpl = `${adapter.event}${event}="{{r['${event}']}}"`;
      return cur + tmpl;
    }, '');
    const template = `
<template name="RAX_TMPL_0_${componentTag}">
  <${componentTag}
    data-private-node-id="{{r.nodeId}}"
    data-private-page-id="{{r.pageId}}"
    ${props}
    ${events}
  >
    <block ${adapter.for}="{{r.children}}" ${adapter.key}="nodeId">
      <block ${adapter.if}="{{item['slot']}}">
        <view slot="{{item['slot']}}">
          <element r="{{item}}" />
        </view>
      </block>
      <block ${adapter.else}>
        <block ${adapter.if}="{{item.nodeId}}">
          <element r="{{item}}" />
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
