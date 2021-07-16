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
    const { mainPackageName } = cache.getConfig();
    const window = cache.getWindow(mainPackageName);

    if (internal.$batchedUpdates) {
      let callback;
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
      this.__renderStacks.forEach(task => {
        const path = task.path;
        if (task.type === 'children') {
          const latestValue = getProperty(internal.data, path, cacheData);
          // path cache should save latest latestValue
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
        }
      });

      if (!internal.firstRender) {
        for (const path in renderObject) {
          childrenValuePaths.forEach(cp => {
            if (path.includes(cp) && cp !== path) {
              delete renderObject[path];
            }
          });
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

