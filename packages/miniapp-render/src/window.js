import EventTarget from './event/event-target';
import OriginalCustomEvent from './event/custom-event';
import cache from './utils/cache';
import Node from './node/node';
import Element from './node/element';

let lastRafTime = 0;
class Window extends EventTarget {
  constructor() {
    super();
    const timeOrigin = +new Date();

    this._customEventConstructor = class CustomEvent extends OriginalCustomEvent {
      constructor(name = '', options = {}) {
        options.timeStamp = +new Date() - timeOrigin;
        super(name, options);
      }
    };

    // Collect event handlers which undifferentiated pages
    this.__sharedHandlers = [];

    // Simulate for react
    this.HTMLIFrameElement = function() {};
  }

  // Trigger node event
  _trigger(eventName, options = {}) {
    if (eventName === 'error' && typeof options.event === 'string') {
      const errStack = options.event;
      const errLines = errStack.split('\n');
      let message = '';
      for (let i = 0, len = errLines.length; i < len; i++) {
        const line = errLines[i];
        if (line.trim().indexOf('at') !== 0) {
          message += line + '\n';
        } else {
          break;
        }
      }

      const error = new Error(message);
      error.stack = errStack;
      options.event = new this._customEventConstructor('error', {
        target: this,
        __extra: {
          message,
          filename: '',
          lineno: 0,
          colno: 0,
          error,
        },
      });
      options.args = [message, error];

      if (typeof this.onerror === 'function' && !this.onerror.__isOfficial) {
        const oldOnError = this.onerror;
        this.onerror = (event, message, error) => {
          oldOnError.call(this, message, '', 0, 0, error);
        };
        this.onerror.__isOfficial = true;
      }
    }
    return super._trigger(eventName, options);
  }

  /**
   * External properties and methods
   */
  get document() {
    return cache.getDocument(this.__pageId);
  }

  get CustomEvent() {
    return this._customEventConstructor;
  }

  get self() {
    return this;
  }

  get setTimeout() {
    return setTimeout.bind(null);
  }

  get clearTimeout() {
    return clearTimeout.bind(null);
  }

  get setInterval() {
    return setInterval.bind(null);
  }

  get clearInterval() {
    return clearInterval.bind(null);
  }

  get HTMLElement() {
    return function(...args) {
      return new Element(...args);
    };
  }

  get Element() {
    return Element;
  }

  get Node() {
    return Node;
  }

  get RegExp() {
    return RegExp;
  }

  get Math() {
    return Math;
  }

  get Number() {
    return Number;
  }

  get Boolean() {
    return Boolean;
  }

  get String() {
    return String;
  }

  get Date() {
    return Date;
  }

  get Symbol() {
    return Symbol;
  }

  getComputedStyle() {
    // Only for compatible use
    console.warn('window.getComputedStyle is not supported.');
  }

  requestAnimationFrame(callback) {
    if (typeof callback !== 'function') return;

    const now = new Date();
    const nextRafTime = Math.max(lastRafTime + 16, now);
    return setTimeout(() => {
      callback(nextRafTime);
      lastRafTime = nextRafTime;
    }, nextRafTime - now);
  }

  cancelAnimationFrame(timeId) {
    return clearTimeout(timeId);
  }
}

export default function createWindow() {
  const { mainPackageName, subPackages } = cache.getConfig();
  const { shareMemory } = subPackages || {};
  if (mainPackageName === '' || !shareMemory) {
    return new Window();
  }
  const mainPackageWindow = cache.getWindow(mainPackageName);
  if (mainPackageWindow) return mainPackageWindow;
  return new Window();
}
