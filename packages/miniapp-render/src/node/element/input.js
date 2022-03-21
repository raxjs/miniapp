import Element from '../element';
import { omitFalsyFields, joinClassNames } from '../../utils/tool';


class HTMLInputElement extends Element {
  constructor(options) {
    super(options);
    this.__changed = false;
  }

  /**
   * The cloneNode interface is invoked to handle additional properties
   */
  _dealWithAttrsForCloneNode() {
    return {
      type: this.type,
      value: this.value,
      disabled: this.disabled,
      maxlength: this.maxlength,
      placeholder: this.placeholder,

      // Special field
      mpplaceholderclass: this.mpplaceholderclass
    };
  }

  setAttribute(name, value, immediate = true) {
    if (name === 'focus' || name === 'autofocus' || name === 'autoFocus') {
      // autoFocus is passed by rax-textinput
      name = 'focus-state';
    }
    if (name === 'value') {
      this.__changed = true;
    }
    super.setAttribute(name, value, immediate);
  }

  // Sets properties, but does not trigger updates
  _setAttributeWithDelayUpdate(name, value) {
    if (name === 'focus' || name === 'autofocus' || name === 'autoFocus') {
      // autoFocus is passed by rax-textinput
      name = 'focus-state';
    }
    if (name === 'value') {
      this.__changed = true;
    }
    super._setAttributeWithDelayUpdate(name, value);
  }

  getAttribute(name) {
    if (name === 'focus' || name === 'autofocus' || name === 'autoFocus') {
      // autoFocus is passed by rax-textinput
      name = 'focus-state';
    }
    return this.__attrs.get(name);
  }

  get _renderInfo() {
    return omitFalsyFields({
      nodeId: this.__nodeId,
      nodeType: 'input',
      ...this.__attrs.__value,
      style: this.style.cssText,
      class: joinClassNames('h5-input', this.className),
    }, ['style']);
  }

  // Attribute
  get name() {
    return this.__attrs.get('name');
  }

  set name(value) {
    value = '' + value;
    this.__attrs.set('name', value);
  }

  get type() {
    return this.__attrs.get('type') || 'text';
  }

  set type(value) {
    value = '' + value;
    this.__attrs.set('type', value);
  }

  get value() {
    let value = this.__attrs.get('value');
    if (!value && !this.__changed) {
      value = this.__attrs.get('defaultValue');
    }
    return value || '';
  }

  set value(value) {
    this.__changed = true;
    value = '' + value;
    this.__attrs.set('value', value);
  }

  get readOnly() {
    return !!this.__attrs.get('readOnly');
  }

  set readOnly(value) {
    this.__attrs.set('readOnly', !!value);
  }

  get disabled() {
    return !!this.__attrs.get('disabled');
  }

  set disabled(value) {
    value = !!value;
    this.__attrs.set('disabled', value);
  }

  get maxlength() {
    return this.__attrs.get('maxlength');
  }

  set maxlength(value) {
    this.__attrs.set('maxlength', value);
  }

  get placeholder() {
    return this.__attrs.get('placeholder') || '';
  }

  set placeholder(value) {
    value = '' + value;
    this.__attrs.set('placeholder', value);
  }

  set checked(value) {
    this.__attrs.set('checked', value);
  }

  get checked() {
    return this.__attrs.get('checked') || '';
  }

  blur() {
    this.setAttribute('focus', false);
  }

  focus() {
    this.setAttribute('focus', true);
  }
}

export default HTMLInputElement;
