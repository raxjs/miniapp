import Element from './element';
import cache from '../utils/cache';
import perf from '../utils/perf';
import { isFunction } from '../utils/tool';

class RootElement extends Element {
  constructor(options) {
    super(options);
    this.__nodeId = options.nodeId;
    this.__allowRender = true;
    this.__renderStacks = [];
    this.__renderCallbacks = [];
  }

  _destroy() {
    super._destroy();
    this.__allowRender = null;
    this.__renderStacks = null;
  }

  get _path() {
    return 'root';
  }
  get _root() {
    return this;
  }

  _enqueueRender(payload) {
    clearTimeout(this.__timer);
    this.__timer = setTimeout(() => {
      this._executeRender();
    }, 0);
    this.__renderStacks.push(payload);
  }

  _executeRender() {
    if (!this.__allowRender) {
      return;
    }
    if (process.env.NODE_ENV === 'development') {
      perf.start('setData');
    }
    // type 1: { path, start, deleteCount, item? } => need to simplify item
    // type 2: { path, value }

    const internal = cache.getDocument(this.__pageId)._internal;
    const { mainPackageName } = cache.getConfig();
    const window = cache.getWindow(mainPackageName);

    if (internal.$batchedUpdates) {
      let callback;
      // there is no need to aggregate arrays if $batchedUpdate and $spliceData exist
      internal.$batchedUpdates(() => {
        this.__renderStacks.forEach((task, index) => {
          if (index === this.__renderStacks.length - 1) {
            callback = () => {
              window._trigger('setDataFinished');
              if (process.env.NODE_ENV === 'development') {
                perf.stop('setData');
              }
              let fn;
              while (fn = this.__renderCallbacks.pop()) {
                fn();
              }
            };
            internal.firstRenderCallback();
          }
          if (task.type === 'children') {
            const spliceArgs = [task.start, task.deleteCount];
            internal.$spliceData({
              [task.path]: task.item ? spliceArgs.concat(task.item) : spliceArgs
            }, callback);
          } else {
            internal.setData({
              [task.path]: task.value
            }, callback);
          }
        });
      });
    } else {
      const renderObject = Object.create(null);
      const childrenValuePaths = [];
      this.__renderStacks.forEach(task => {
        const path = task.path;
        if (task.type === 'children') {
          childrenValuePaths.push(path);
        }
        renderObject[path] = task.value;
      });
      for (const path in renderObject) {
        // If the whole father children path is set, then its children path can be deleted
        childrenValuePaths.forEach(cp => {
          if (path.includes(cp) && cp !== path) {
            delete renderObject[path];
          }
        });
        const value = renderObject[path];
        if (isFunction(value)) {
          renderObject[path] = value();
        }
      }
      internal.firstRenderCallback(renderObject);
      internal.setData(renderObject, () => {
        window._trigger('setDataFinished');
        let fn;
        while (fn = this.__renderCallbacks.pop()) {
          fn();
        }
        if (process.env.NODE_ENV === 'development') {
          perf.stop('setData');
        }
      });
    }

    this.__renderStacks = [];
  }
}

export default RootElement;

