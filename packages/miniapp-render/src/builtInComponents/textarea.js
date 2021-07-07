// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram, isBaiduSmartProgram } from 'universal-env';
import { isUndef } from '../utils/tool';

const textarea = {
  name: 'textarea',
  singleEvents: [{
    name: 'onTextareaKeyboardHeightChange',
    eventName: 'keyboardheightchange'
  }],
  simpleEvents: [{
    name: 'onTextareaConfirm',
    eventName: 'confirm'
  }],
  complexEvents: [{
    name: 'onTextareaFocus',
    eventName: 'input',
    middleware(evt, domNode, nodeId) {
      domNode.__textareaOldValue = domNode.value || '';
      domNode._setAttributeWithOutUpdate('focus-state', true);
      this.callSimpleEvent('focus', evt, domNode);
    }
  },
  {
    name: 'onTextareaBlur',
    eventName: 'blur',
    middleware(evt, domNode, nodeId) {
      domNode._setAttributeWithOutUpdate('focus-state', false);
      if (!isUndef(domNode.__textareaOldValue) && domNode.value !== domNode.__textareaOldValue) {
        domNode.__textareaOldValue = undefined;
        this.callEvent('change', evt, null, nodeId);
      }
      this.callSimpleEvent('blur', evt, domNode);
    }
  },
  {
    name: 'onTextareaInput',
    eventName: 'input',
    middleware(evt, domNode, nodeId) {
      const value = '' + evt.detail.value;
      domNode._setAttributeWithOutUpdate('value', value);

      this.callEvent('input', evt, null, nodeId);
    }
  }]
};

if (isWeChatMiniProgram || isBaiduSmartProgram) {
  textarea.simpleEvents = textarea.simpleEvents.concat([{
    name: 'onTextareaLineChange',
    eventName: 'linechange'
  }]);
}

export default textarea;
