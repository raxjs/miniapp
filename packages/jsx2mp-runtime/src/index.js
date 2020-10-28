import { runApp, createComponent, createPage } from './bridge';
import { useAppLaunch, useAppShow, useAppHide, useAppShare, useAppError } from './app';
import { usePageShow, usePageHide, withPageLifeCycle } from './page';
import { withRouter } from './router';
import { getSearchParams } from './history';
import Component from './component';
import createStyle from './createStyle';
import createContext from './createContext';
import classnames from './classnames';
import createRef from './createRef';
import { addNativeEventListener, removeNativeEventListener, registerNativeEventListeners } from './nativeEventListener';
import memo from './memo';
import version from './version';
import forwardRef from './forwardRef';

// Adapter rax core
const shared = {};

export {
  runApp,
  createPage,
  createComponent,
  createStyle,
  createContext,
  classnames,
  createRef,

  Component,

  // Cycles
  useAppLaunch,
  useAppShow,
  useAppHide,
  useAppShare,
  useAppError,

  usePageShow,
  usePageHide,
  withPageLifeCycle,

  // Router
  withRouter,
  getSearchParams,

  // Native events
  addNativeEventListener,
  removeNativeEventListener,
  registerNativeEventListeners,

  // Shared
  shared,
  // Memo
  memo,

  // Version
  version,

  // ForwardRef
  forwardRef
};

/* hooks */
export * from './hooks';
