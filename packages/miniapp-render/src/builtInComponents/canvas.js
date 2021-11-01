// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

const canvas = {
  name: 'canvas',
  singleEvents: [{
    name: 'onCanvasTouchStart',
    eventName: 'touchstart'
  },
  {
    name: 'onCanvasTouchMove',
    eventName: 'touchmove'
  },
  {
    name: 'onCanvasTouchEnd',
    eventName: 'touchend'
  },
  {
    name: 'onCanvasTouchCancel',
    eventName: 'touchcancel'
  },
  {
    name: 'onCanvasLongTap',
    eventName: 'longtap'
  },
  {
    name: 'onCanvasError',
    eventName: 'error'
  }]
};

if (isMiniApp) {
  canvas.singleEvents = canvas.singleEvents.concat([{
    name: 'onCanvasReady',
    eventName: 'ready'
  }]);
}

export default canvas;
