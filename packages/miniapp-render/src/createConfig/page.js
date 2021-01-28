import cache from '../utils/cache';
import injectLifeCycle from '../bridge/injectLifeCycle';
import createEventProxy from '../bridge/createEventProxy';
import createDocument from '../document';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import { BODY_NODE_ID } from '../constants';
import { createWindow } from '../window';

export function getBaseLifeCycles(route, init, packageName = 'main') {
  return {
    async onLoad(query) {
      // eslint-disable-next-line no-undef
      const app = getApp();

      this.pageId = route + '-' + cache.getRouteId(route);
      if (this.pageId === app.__pageId) {
        this.document = cache.getDocument(this.pageId);
      } else {
        this.document = createDocument(this.pageId);
      }

      const isBundleLoaded = cache.hasWindow(packageName);

      if (isBundleLoaded) {
        this.window = cache.getWindow(packageName);
      } else {
        this.window = createWindow();
        cache.setWindow(packageName, this.window);
        init(this.window, this.document);
      }

      // In wechat miniprogram web bundle need be executed in first page
      if (!isMiniApp && !app.launched) {
        app.init(this.document);
        app.launched = true;
        // The real app show has passed when init function execute
        app.onShow.call(app, app.__showOptions);
      }
      // Bind page internal to page document
      this.document._internal = this;
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
      await this.renderInfo.render();

      this.document.$$trigger('DOMContentLoaded');
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
        this.document.$$trigger('miniapp_pageshow');
        // compatible with original name
        this.document.$$trigger('onShow');
      }
    },
    onHide() {
      if (this.window) {
        this.document.$$trigger('miniapp_pagehide');
        // compatible with original name
        this.document.$$trigger('onHide');
      }
    },
    onUnload() {
      this.document.$$trigger('miniapp_pagehide');
      this.document.$$trigger('beforeunload');
      this.document.$$trigger('pageunload');

      this.document.__unmount && this.document.__unmount(); // Manually unmount component instance
      this.document.body.$$destroy();

      cache.destroy(this.pageId);

      this.pageId = null;
      this.window = null;
      this.document = null;
      this.query = null;
    }
  };
}

export default function(route, lifeCycles = [], init, packageName = 'main') {
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
          pageId: this.pageId,
          'root.pageId': this.pageId,
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
