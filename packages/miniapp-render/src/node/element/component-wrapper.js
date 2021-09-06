import Element from '../element';
import cache from '../../utils/cache';
import { getId } from '../../utils/tool';

class ComponentWrapper extends Element {
  constructor(options) {
    super(options);
    this.__nativeType = options.nativeType;
    cache.setComponentWrapperNode(this._path, this);
  }

  _destroy() {
    super._destroy();

    this.__nativeType = null;
    cache.setComponentWrapperNode(this._path, null);
  }

  get _renderInfo() {
    const renderInfo = {
      nodeId: this.__nodeId,
      pageId: this.__pageId,
      nodeType: this.__tagName,
      style: this.style.cssText,
      className: this.className,
      ...this.__attrs.__value
    };
    return renderInfo;
  }
}

export default ComponentWrapper;
