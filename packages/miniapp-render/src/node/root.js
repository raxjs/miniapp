import Element from './element';
import cache from '../utils/cache';
import perf from '../utils/perf';
import getProperty from '../utils/getProperty';

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

    if (internal.$batchedUpdates) {
      let callback;
      internal.$batchedUpdates(() => {
        this.__renderStacks.forEach((task, index) => {
          if (index === this.__renderStacks.length - 1) {
            callback = () => {
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
          // there is no need to aggregate arrays if $batchedUpdate and $spliceData exist
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
      const renderObject = {};
      const cacheData = [];

      const childrenValuePaths = [];
      const nonChildrenValuePaths = [];
      this.__renderStacks.forEach(task => {
        const path = task.path;
        if (task.type === 'children') {
          const latestValue = getProperty(internal.data, path, cacheData);
          // path cache should save lastest latestValue
          cacheData.push({
            cachedPath: task.path,
            value: latestValue
          });

          if (!renderObject[path]) {
            renderObject[path] = latestValue ? [...latestValue] : [];
          }
          if (task.item) {
            renderObject[path].splice(task.start, task.deleteCount, task.item);
          } else {
            renderObject[path].splice(task.start, task.deleteCount);
          }
          childrenValuePaths.push(path);
        } else {
          renderObject[path] = task.value;
          nonChildrenValuePaths.push(path);
        }
      });

      // Remove those specific values that have included in setting children value
      for (const nonChilrenValuePath of nonChildrenValuePaths) {
        for (const childrenValuePath of childrenValuePaths) {
          if (nonChilrenValuePath.includes(childrenValuePath)) {
            delete renderObject[nonChilrenValuePath];
          }
        }
      }

      internal.firstRenderCallback(renderObject);
      internal.setData(renderObject, () => {
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

