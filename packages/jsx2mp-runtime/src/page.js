// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp } from 'universal-env';
import { isFunction } from './types';
import {
  ON_SHOW,
  ON_HIDE,
} from './cycles';
import { useEffect } from './hooks';
import { getMiniAppHistory } from './history';
import { getPageInstanceById } from './pageInstanceMap';
import { getModernMode } from './version';

export const cycles = {};

function addPageLifeCycle(cycle, callback) {
  const history = getMiniAppHistory();
  const pageId = history && history.location._pageId;
  if (!cycles[pageId]) {
    cycles[pageId] = {};
  }
  if (!cycles[pageId][cycle]) {
    cycles[pageId][cycle] = [];
  }
  cycles[pageId][cycle].push(callback);

  // Define page instance life cycle when the cycle is used
  const pageInstance = getPageInstanceById(pageId);
  if (!pageInstance._internal[cycle]) {
    pageInstance._internal[cycle] = (e) => {
      return pageInstance._trigger(cycle, e);
    };
  }
}

export function usePageEffect(cycle, callback) {
  if (isFunction(callback)) {
    switch (cycle) {
      case ON_SHOW:
      case ON_HIDE:
        useEffect(() => {
          if ((isQuickApp || getModernMode()) && cycle === ON_SHOW) {
            callback();
          }
          addPageLifeCycle(cycle, callback);
        }, []);
        break;
      default:
        throw new Error('Unsupported page cycle ' + cycle);
    }
  }
}

export function usePageShow(callback) {
  return usePageEffect(ON_SHOW, callback);
}

export function usePageHide(callback) {
  return usePageEffect(ON_HIDE, callback);
}

export function withPageLifeCycle(Klass) {
  return class extends Klass {
    constructor(...args) {
      super(...args);
      [ON_SHOW, ON_HIDE].forEach(cycle => {
        if (isFunction(this[cycle])) {
          addPageLifeCycle(cycle, this[cycle]);
        }
      });
    }
  };
}
