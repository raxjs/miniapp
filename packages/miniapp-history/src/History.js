import generateActions, { __updateRouterMap } from './router';
import Location from './Location';
import { addListener } from './listeners';

export default class MiniAppHistory {
  constructor(routes) {
    this.location = new Location();
    __updateRouterMap(routes);
    // Apply actions for history.
    Object.assign(this, generateActions(this.location));
  }

  get length() {
    // eslint-disable-next-line no-undef
    return getCurrentPages().length;
  }

  listen(callback) {
    const listeners = addListener(this.location._pageId, callback);
    return function() {
      let index = -1;
      for (let idx in listeners) {
        if (listeners[idx] === callback) {
          index = idx;
          break;
        }
      }
      if (index > -1) listeners.splice(index, 1);
    };
  }
}
