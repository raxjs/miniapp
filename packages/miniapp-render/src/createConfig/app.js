// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import createWindow from '../window';
import createDocument from '../document';
import cache from '../utils/cache';

export default function(init, config, packageName = '', nativeAppConfig = {}) {
  cache.setConfig({
    ...config,
    mainPackageName: packageName,
  });
  const { onLaunch, onShow, onHide, onError, onPageNotFound, ...rest } = nativeAppConfig;
  const appConfig = {
    launched: isMiniApp,
    onLaunch(options) {
      onLaunch && onLaunch.call(this, options);

      const window = createWindow();
      cache.setWindow(packageName, window);

      // In wechat miniprogram getCurrentPages() length is 0, so web bundle only can be executed in first page
      if (isMiniApp) {
        // Use page route as pageId key word
        // eslint-disable-next-line no-undef
        const currentPageId = `${getCurrentPages()[0].route}-1`;
        const currentDocument = createDocument(currentPageId);
        this.__pageId = window.__pageId = currentPageId;

        init(window, currentDocument);
        window._trigger('launch', {
          event: {
            options,
            context: this
          }
        });
      } else {
        this.init = (document) => {
          init(window, document);
          window._trigger('launch', {
            event: {
              options,
              context: this
            }
          });
        };
      }
      this.window = window;
    },
    onShow(options) {
      onShow && onShow.call(this, options);

      this.__showOptions = options;
      if (this.window && this.launched) {
        this.window._trigger('appshow', {
          event: {
            options,
            context: this
          }
        });
      }
    },
    onHide() {
      onHide && onHide.call(this);

      if (this.window) {
        this.window._trigger('apphide', {
          event: {
            context: this
          }
        });
      }
    },
    onError(err) {
      onError && onError.call(this, err);

      if (this.window) {
        // eslint-disable-next-line no-undef
        const pages = getCurrentPages() || [];
        const currentPage = pages[pages.length - 1];
        if (currentPage && currentPage.window) {
          currentPage.window._trigger('error', {
            event: err
          });
        }
        this.window._trigger('apperror', {
          event: {
            context: this,
            error: err
          }
        });
      }
    },
    onPageNotFound(options) {
      onPageNotFound && onPageNotFound.call(this, options);

      if (this.window) {
        this.window._trigger('pagenotfound', {
          event: {
            options,
            context: this
          }
        });
      }
    },
    // document modify callback for override context's document
    __documentModifyCallbacks: [],
    _dispatchDocumentModify(val) {
      // dispatch document modify when page toggle
      this.__documentModifyCallbacks.forEach(cb => {
        cb(val);
      });
    },
    ...rest
  };
  if (isMiniApp) {
    appConfig.onShareAppMessage = function(options) {
      if (this.window) {
        const shareInfo = {};
        this.window._trigger('appshare', {
          event: { options, shareInfo }
        });
        return shareInfo.content;
      }
    };
  }
  return appConfig;
}
