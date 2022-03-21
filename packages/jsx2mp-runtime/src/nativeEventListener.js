import { getMiniAppHistory } from './history';
import { getPageInstanceById } from './pageInstanceMap';
import getNativeEventBindTarget from './adapter/getNativeEventBindTarget';
import { EVENTS_LIST } from './cycles';

export function registerEventsInConfig(Klass, events = []) {
  events.forEach(eventName => {
    const shouldReturnConfig = EVENTS_LIST.indexOf(eventName) < 0; // shouldReturnConfig controls the events injected into Page obj or Page.events obj
    const eventBindTarget = getNativeEventBindTarget(Klass, shouldReturnConfig);
    const defaultLifeCycleEvent = eventBindTarget[eventName];
    eventBindTarget[eventName] = function(...args) {
      // onShareAppMessage need receive callback execute return
      defaultLifeCycleEvent && defaultLifeCycleEvent.apply(this, args); // Execute default lifecycle events like onShow
      let ret;
      const pageInstance = getPageInstance();
      if (pageInstance.__nativeEventMap[eventName]) {
        pageInstance.__nativeEventMap[eventName].forEach(callback => ret = callback(...args));
      }
      return ret;
    };
  });
}

export function registerNativeEventListeners(component, events) {
  component.__nativeEvents = events;
  return component;
}

export function addNativeEventListener(eventName, callback) {
  const pageInstance = getPageInstance();
  if (!pageInstance.__nativeEventMap[eventName]) {
    pageInstance.__nativeEventMap[eventName] = [];
  }
  pageInstance.__nativeEventMap[eventName].push(callback);
}

export function removeNativeEventListener(eventName, callback) {
  const pageInstance = getPageInstance();
  if (pageInstance.__nativeEventMap[eventName]) {
    pageInstance.__nativeEventMap[eventName] = pageInstance.__nativeEventMap[eventName].filter(fn => fn !== callback);
  }
}

function getPageInstance() {
  const history = getMiniAppHistory();
  const pageId = history.location._pageId;
  return getPageInstanceById(pageId);
}
