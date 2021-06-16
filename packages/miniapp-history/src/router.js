/* global my wx tt swan ks */
import { isMiniApp, isWeChatMiniProgram, isByteDanceMicroApp, isBaiduSmartProgram, isKuaiShouMiniProgram } from 'universal-env';
import { fireListeners } from './listeners';
import { REPLACE, POP, PUSH } from './constants';

let __routerMap = {};

let apiCore;

if (isMiniApp) {
  apiCore = my;
} else if (isWeChatMiniProgram) {
  apiCore = wx;
} else if (isByteDanceMicroApp) {
  apiCore = tt;
} else if (isBaiduSmartProgram) {
  apiCore = swan;
} else if (isKuaiShouMiniProgram) {
  apiCore = ks;
}

function redirectTo(location, options) {
  options.success = () => {
    fireListeners(location, REPLACE);
  };
  apiCore.redirectTo(options);
}

function navigateTo(location, options) {
  options.success = () => {
    fireListeners(location, PUSH);
  };
  apiCore.navigateTo(options);
}

function navigateBack(location, options) {
  apiCore.navigateBack(options);
  fireListeners(location, POP);
}

/**
 * Navigate to given path.
 */
function push(location, path, query) {
  return navigateTo(location, { url: generateUrl(path, query) });
}

/**
 * Navigate replace.
 */
function replace(location, path, query) {
  return redirectTo(location, { url: generateUrl(path, query) });
}

/**
 * Unsupported in miniapp.
 */
function go() {
  throw new Error('Unsupported go in miniapp.');
}

/**
 * Navigate back.
 */
function back(location, n = 1) {
  return navigateBack(location, { delta: n });
}

/**
 * Navigate back.
 */
function goBack(location, n = 1) {
  return navigateBack(location, { delta: n });
}

/**
 * Unsupported in miniapp.
 */
function goForward() {
  throw new Error('Unsupported goForward in miniapp.');
}

/**
 * Unsupported in miniapp.
 * @return {boolean} Always true.
 */
function canGo() {
  return true;
}

/**
 * Generate MiniApp url
 * @param {string} path
 * @param {object} query
 */
function generateUrl(path, query) {
  let [pathname, search] = path.split('?');
  const miniappPath = __routerMap[pathname];
  if (!miniappPath) {
    throw new Error(`Path ${path} is not found`);
  }
  if (query) {
    if (search) {
      search += `&${stringifyQuery(query)}`;
    } else {
      search = stringifyQuery(query);
    }
  }

  return search ? `/${miniappPath}?${search}` : `/${miniappPath}`;
}

/**
 * Stringify query
 * @param {object} query - route query
 * @return {string}
 */
function stringifyQuery(query) {
  return Object.keys(query).reduce((total, nextKey, index) => {
    return `${total}${index ? '&' : ''}${nextKey}=${query[nextKey]}`;
  }, '');
}

export function __updateRouterMap(routes) {
  routes.map(route => {
    __routerMap[route.path] = route.source;
  });
}

export default function generateActions(location) {
  const actions = {
    push, replace, back, go, canGo, goForward, goBack
  };
  return Object.keys(actions).reduce((result, actionName) => {
    result[actionName] = actions[actionName].bind(null, location);
    return result;
  }, {});
}
