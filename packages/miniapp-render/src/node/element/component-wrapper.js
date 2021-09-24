import { omitFalsyFields } from '../../utils/tool';
import Element from '../element';

class ComponentWrapper extends Element {
  constructor(options) {
    super(options);
    this.__nativeType = options.nativeType;
    this.__componentWrapperId = this.__nodeId;
  }

  _destroy() {
    super._destroy();
    this.__nativeType = null;
    this.__componentWrapperId = null;
  }

  get _renderInfo() {
    const renderInfo = omitFalsyFields({
      nodeId: this.__nodeId,
      nodeType: this.__tagName,
      style: this.style.cssText,
      class: this.className,
      ...this.__attrs.__value
    }, ['class', 'style']);
    return renderInfo;
  }
}

export default ComponentWrapper;
