module.exports = function() {
  return `
  import { render, createElement, useEffect, Component } from 'rax';
  import DriverUniversal from 'driver-universal';
  import miniappRenderer from 'miniapp-renderer';
  import createShareAPI from 'create-app-shared';

  import pluginConfig from '../src/plugin.json';

  function mount(appInstance, rootEl) {
    return render(appInstance, rootEl, {
      driver: DriverUniversal,
    });
  }

  function unmount(appInstance) {
    return appInstance._internal.unmountComponent.bind(appInstance._internal);
  }

  const { createBaseApp, createHistory, emitLifeCycles } = createShareAPI(
    {
      createElement,
      useEffect,
      initHistory: false
    },
    () => {}
  );

  function runApp() {
    miniappRenderer(
      {
        staticConfig: pluginConfig,
        createBaseApp,
        createHistory,
        emitLifeCycles,
      },
      {
        createElement,
        mount,
        unmount,
        Component,
      }
    );
  }

  runApp();
  `;
};
