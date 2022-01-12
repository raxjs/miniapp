// Page id -> action callbacks
const listeners = {};

/**
 * Add history listener
 * @param {string} pageId page unique id
 * @param {function} callback history operate action callback
 * @return {Array} target page listener list
 */
export function addListener(pageId, callback) {
  if (!listeners[pageId]) listeners[pageId] = [];
  listeners[pageId].push(callback);
  return listeners[pageId];
}

/**
 * Fire history listeners
 * @param {object} location router location object
 * @param {string} action history operate action
 */
export function fireListeners(location, action) {
  const pageId = location._pageId;
  if (listeners[pageId]) {
    for (let index in listeners[pageId]) {
      listeners[pageId][index]({ location, action });
    }
  }
}
