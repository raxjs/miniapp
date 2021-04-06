import { isUndef } from '../utils/tool';

const input = {
  name: 'input',
  simpleEvents: [{
    name: 'onInputConfirm',
    eventName: 'confirm'
  }],
  singleEvents: [{
    name: 'onInputKeyBoardHeightChange',
    eventName: 'keyboardheightchange'
  }],
  complexEvents: [{
    name: 'onInputInput',
    eventName: 'input',
    middleware(evt, domNode, nodeId) {
      const value = '' + evt.detail.value;
      domNode._setAttributeWithOutUpdate('value', value);

      this.callEvent('input', evt, null, nodeId);
    }
  },
  {
    name: 'onInputFocus',
    eventName: 'focus',
    middleware(evt, domNode, nodeId) {
      domNode.__inputOldValue = domNode.value || '';
      domNode._setAttributeWithOutUpdate('focus-state', true);

      this.callSimpleEvent('focus', evt, domNode);
    }
  },
  {
    name: 'onInputBlur',
    eventName: 'blur',
    middleware(evt, domNode, nodeId) {
      domNode._setAttributeWithOutUpdate('focus-state', false);

      if (!isUndef(domNode.__inputOldValue) && domNode.value !== domNode.__inputOldValue) {
        domNode.__inputOldValue = undefined;
        this.callEvent('change', evt, null, nodeId);
      }
      this.callSimpleEvent('blur', evt, domNode);
    }
  }]
};

export default input;
