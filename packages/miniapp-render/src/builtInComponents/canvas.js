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

export default canvas;
