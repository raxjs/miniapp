// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

import Element from './element';
import cache from '../utils/cache';
import perf from '../utils/perf';
import { isFunction } from '../utils/tool';

/**
 * Return a function that filter render stacks by whether task occurs in Component-Wrapper
 */
function getFilterRenderStacks() {
  if (isMiniApp) {
    // In Miniapp, if sdk version != 2.x and can't use component 2, all stacks shall be passed by Page.setData although in Component-Wrapper
    if (my.SDKVersion.startsWith('2') || my.canIUse('component2')) {
      return (renderStacks) => {
        const rootStacks = [];
        const componentWrapperObject = Object.create(null);

        renderStacks.forEach(task => {
          const path = task.path;
          let componentWrapperNode = null;
          if (task.componentWrapperId) {
            componentWrapperNode = cache.getNode(task.componentWrapperId);
          }
          if (componentWrapperNode) {
            if (!componentWrapperObject[task.componentWrapperId]) {
              componentWrapperObject[task.componentWrapperId] = {
                node: componentWrapperNode,
                data: []
              };
            }
            componentWrapperObject[task.componentWrapperId].data.push({
              ...task,
              path: 'r' + path.replace(componentWrapperNode._path, '')
            });
          } else {
            rootStacks.push(task);
          }
        });
        return {
          rootStacks,
          componentWrapperObject
        };
      };
    }

    return (renderStacks) => {
      return {
        rootStacks: renderStacks,
        componentWrapperObject: Object.create(null)
      };
    };
  }

  return (renderStacks) => {
    const rootStacks = [];
    const componentWrapperObject = Object.create(null);
    const renderObject = Object.create(null);
    const childrenValuePaths = [];

    renderStacks.forEach(task => {
      const path = task.path;
      if (task.type === 'children') {
        childrenValuePaths.push(path);
      }
      renderObject[path] = task;
    });

    for (const path in renderObject) {
      // If the whole father children path is set, then its children path can be deleted
      childrenValuePaths.forEach(cp => {
        if (path.includes(cp) && cp !== path) {
          delete renderObject[path];
        }
      });

      const task = renderObject[path];
      if (task) {
        let componentWrapperNode = null;
        if (task.componentWrapperId) {
          componentWrapperNode = cache.getNode(task.componentWrapperId);
        }
        if (componentWrapperNode) {
          if (!componentWrapperObject[task.componentWrapperId]) {
            componentWrapperObject[task.componentWrapperId] = {
              node: componentWrapperNode,
              data: []
            };
          }
          componentWrapperObject[task.componentWrapperId].data.push({
            ...task,
            path: 'r' + path.replace(componentWrapperNode._path, '')
          });
        } else {
          rootStacks.push(task);
        }
      }
    }

    return {
      rootStacks,
      componentWrapperObject
    };
  };
}

class RootElement extends Element {
  constructor(options) {
    super(options);
    this.__nodeId = options.nodeId;
    this.__allowRender = true;
    this.__renderStacks = [];
    this.__renderCallbacks = [];
    this._filterRenderStacks = getFilterRenderStacks();
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

    const { rootStacks, componentWrapperObject } = this._filterRenderStacks(this.__renderStacks);
    const componentWrapperCount = Object.keys(componentWrapperObject).length;
    let count = rootStacks.length + componentWrapperCount;

    const callback = () => {
      count--;
      if (!count) {
        window._trigger('setDataFinished');
        let fn;
        while (fn = this.__renderCallbacks.pop()) {
          fn();
        }
        if (process.env.NODE_ENV === 'development') {
          perf.stop('setData');
        }
      }
    };

    if (rootStacks.length > 0) {
      if (internal.$batchedUpdates) {
        internal.firstRenderCallback();
        this._batchedUpdate(internal, internal, rootStacks, callback);
      } else {
        const renderObject = Object.create(null);
        rootStacks.forEach((task) => {
          renderObject[task.path] = isFunction(task.value) ? task.value() : task.value;
        });
        internal.firstRenderCallback(renderObject);
        internal.setData(renderObject, callback);
      }
    }

    if (componentWrapperCount > 0) {
      Object.values(componentWrapperObject).forEach(({ node, data }) => {
        if (internal.$batchedUpdates) {
          internal.firstRenderCallback();
          this._batchedUpdate(internal, node._internal, data, callback);
        } else {
          const renderObject = Object.create(null);
          data.forEach((task) => {
            renderObject[task.path] = isFunction(task.value) ? task.value() : task.value;
          });
          internal.firstRenderCallback(renderObject);
          node._internal.setData(renderObject, callback);
        }
      });
    }

    this.__renderStacks = [];
  }

  _batchedUpdate(pageInternal, internal, stacks, callback) {
    pageInternal.$batchedUpdates(() => {
      stacks.forEach(task => {
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
  }
}

export default RootElement;

