import Node from '../node/node';

class TextNode extends Node {
  constructor(options) {
    options.type = 'text';

    super(options);

    this.__content = options.content || '';
  }

  _destroy() {
    super._destroy();

    this.__content = '';
  }

  _triggerUpdate(payload) {
    this._root._enqueueRender(payload);
  }

  get _renderInfo() {
    return {
      nodeType: `h-${this.__type}`,
      content: this.__content,
    };
  }

  get nodeName() {
    return '#text';
  }

  get nodeType() {
    return Node.TEXT_NODE;
  }

  get nodeValue() {
    return this.textContent;
  }

  set nodeValue(value) {
    this.textContent = value;
  }

  get textContent() {
    return this.__content;
  }

  set textContent(value) {
    value += '';

    this.__content = value;
    if (this._isRendered()) {
      const payload = {
        path: `${this._path}.content`,
        value
      };
      this._triggerUpdate(payload);
    }
  }

  get data() {
    return this.textContent;
  }

  set data(value) {
    this.textContent = value;
  }

  cloneNode() {
    return this.ownerDocument.createTextNode(this.__content);
  }
}

export default TextNode;
