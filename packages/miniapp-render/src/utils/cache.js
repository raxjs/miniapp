const pageMap = {};
const routeMap = new Map();
const nodeIdMap = new Map();
let config = {};
const windowMap = new Map();

const elementsCache = [];
const elementMethodsCache = new Map();

// Init
function init(pageId, options) {
  pageMap[pageId] = options.document;
}

// Destroy
function destroy(pageId) {
  delete pageMap[pageId];
}

/**
 * Get document by pageId
 */
function getDocument(pageId) {
  return pageMap[pageId];
}

// Set window
function setWindow(packageName = 'main', value) {
  windowMap.set(packageName, value);
}

/**
 * Get window
 */
function getWindow(packageName = 'main') {
  return windowMap.get(packageName);
}

function hasWindow(packageName = 'main') {
  return windowMap.has(packageName);
}

/**
 * Save domNode map
 */
function setNode(nodeId, domNode = null) {
  nodeIdMap.set(nodeId, domNode);
}

// Get the domNode by nodeId
function getNode(nodeId) {
  return nodeIdMap.get(nodeId);
}


/**
 * Get all nodes
 */
function getAllNodes() {
  return nodeIdMap;
}

// Store global config
function setConfig(value) {
  config = value;
}

// Get global config
function getConfig() {
  return config;
}

function getRouteId(route) {
  const routeId = routeMap.get(route) || 0;
  routeMap.set(route, routeId + 1);
  return routeId + 1;
}

function setElementInstance(instance) {
  elementsCache.push(instance);
  if (elementMethodsCache.size > 0) {
    elementMethodsCache.forEach((methodFn, methodName) => {
      if (!instance[methodName]) {
        instance[methodName] = methodFn;
      }
    });
  }
}

function getElementInstance() {
  return elementsCache;
}

function setElementMethods(methodName, methodFn) {
  if (elementsCache.length > 0) {
    elementsCache.forEach(element => {
      element[methodName] = methodFn;
    });
  }
  elementMethodsCache.set(methodName, methodFn);
}

export default {
  init,
  destroy,
  getDocument,
  setWindow,
  getWindow,
  hasWindow,
  setNode,
  getNode,
  getAllNodes,
  setConfig,
  getConfig,
  getRouteId,
  setElementInstance,
  getElementInstance,
  setElementMethods
};
