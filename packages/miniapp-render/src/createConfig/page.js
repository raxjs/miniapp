// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';

import cache from '../utils/cache';
import injectLifeCycle from '../bridge/injectLifeCycle';
import createEventProxy from '../bridge/createEventProxy';
import createDocument from '../document';
import { BODY_NODE_ID, INDEX_PAGE } from '../constants';
import createWindow from '../window';
import { isFunction } from '../utils/tool';

export function getBaseLifeCycles(route, init, packageName = '') {
  return {
    onLoad(query) {
      // old: init is a function that contains all the logic code
      // now: init is a object that contains page code and bundle code (app.js)
      const isBundled = isFunction(init);
      this.pageId = route + '-' + cache.getRouteId(route);
      // getApp may not exist in situations like plugin project
      // eslint-disable-next-line no-undef
      if (typeof getApp === 'function') {
        // eslint-disable-next-line no-undef
        const app = getApp();
        // In non alibaba miniapp or the first page is from plugin, pageId is set to 'home-page' in app onLaunch
        if (app.__pageId === INDEX_PAGE) {
          this.document = cache.getDocument(INDEX_PAGE);
          this.document._switchPageId(this.pageId);
          cache.destroy(INDEX_PAGE);
          cache.init(this.pageId, this.document);
          app.__pageId = this.pageId;
        } else if (this.pageId === app.__pageId) {
          this.document = cache.getDocument(this.pageId);
        } else {
          this.document = createDocument(this.pageId);
        }
      } else {
        this.document = createDocument(this.pageId);
      }

      const isBundleLoaded = cache.hasWindow(packageName);

      if (isBundleLoaded) {
        this.window = cache.getWindow(packageName);
      } else {
        this.window = createWindow();
        cache.setWindow(packageName, this.window);
        isBundled ? init(this.window, this.document) : init.bundle(this.window, this.document);
      }

      if (!isBundled) {
        init.page(this.window, this.document);
      }

      // Bind page internal to page document
      this.document._internal = this;
      if (isWeChatMiniProgram) {
        cache.setPageInstance(this);
      }
      this.query = query;
      // Update location page options
      this.window.history.location.__updatePageOption(query);
      // Set __pageId to global window object
      this.window.__pageId = this.pageId;

      // Find self render function
      // eslint-disable-next-line no-undef
      this.renderInfo = this.window.__pagesRenderInfo.find(({ path }) => this.pageId.substring(0, this.pageId.lastIndexOf('-')) === path);

      if (!this.renderInfo && process.env.NODE_ENV === 'development') {
        throw new Error("Could't find target render method.");
      }

      this.renderInfo.setDocument(this.document);
      if (isBundled) {
        this.renderInfo.render();
      } else {
        this.window.__render(this.renderInfo.component);
      }
      this.document._trigger('DOMContentLoaded');
    },
    onShow() {
      if (this.window) {
        // Update pageId
        this.window.__pageId = this.pageId;
        if (!this.firstRender) {
          this.renderInfo && this.renderInfo.setDocument(this.document);
          // Update location page options
          this.window.history.location.__updatePageOption(this.query);
        }
        this.document._trigger('miniapp_pageshow');
        // compatible with original name
        this.document._trigger('onShow');
      }
    },
    onHide() {
      if (this.window) {
        this.document._trigger('miniapp_pagehide');
        // compatible with original name
        this.document._trigger('onHide');
      }
    },
    onUnload() {
      // When reLaunch api is invoked, onUnload will be triggered without onShow trigger
      this.renderInfo.setDocument(this.document);

      this.document._trigger('miniapp_pagehide');
      this.document._trigger('beforeunload');
      this.document._trigger('pageunload');

      this.document.__unmount && this.document.__unmount(); // Manually unmount component instance
      this.document.body._destroy();

      cache.destroy(this.pageId);

      this.pageId = null;
      this.window = null;
      this.document = null;
      this.query = null;
    }
  };
}

export default function(route, lifeCycles = [], init, packageName = '') {
  const pageConfig = {
    firstRender: true,
    data: {
      root: {
        nodeId: BODY_NODE_ID,
        nodeType: 'h-element',
        children: []
      }
    },
    firstRenderCallback(task) {
      if (this.firstRender) {
        this.firstRender = false;
        const initData = {
          'root.nodeId': `${BODY_NODE_ID}-${this.pageId}`
        };
        if (task) {
          Object.assign(task, initData);
        } else {
          this.setData(initData);
        }
      }
    },
    ...getBaseLifeCycles(route, init, packageName),
    ...createEventProxy()
  };
  // Define page lifecycles, like onReachBottom
  injectLifeCycle(lifeCycles, pageConfig);
  return pageConfig;
};
