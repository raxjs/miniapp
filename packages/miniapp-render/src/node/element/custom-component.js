import Element from '../element';
import cache from '../../utils/cache';
import { getId } from '../../utils/tool';

class CustomComponent extends Element {
  constructor(options) {
    super(options);
    this.__nativeType = options.nativeType;
  }

  _destroy() {
    super._destroy();

    this.__nativeType = null;
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

    const config = cache.getConfig();
    let nativeInfo = null;
    if (this.__nativeType === 'customComponent') {
      nativeInfo = config.usingComponents[this.__tagName];
    } else if (this.__nativeType === 'miniappPlugin') {
      nativeInfo = config.usingPlugins[this.__tagName];
    }
    if (nativeInfo) {
      // Bind methods to every element which is used recursively to generate dom tree
      nativeInfo.events.forEach(event => {
        const eventName = `${this.__tagName}_${event}_${getId()}`;
        renderInfo[event] = eventName;
        cache.setCustomComponentMethods(eventName, (...args) => {
          this._trigger(event, { args });
        });
      });
    }
    return renderInfo;
  }
}

export default CustomComponent;
