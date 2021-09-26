// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';


// Events which should bubble
const baseEvents = [
  {
    name: 'onTap',
    eventName: 'click',
    extra: {
      button: 0
    }
  },
  {
    name: 'onTouchStart',
    eventName: 'touchstart'
  },
  {
    name: 'onTouchMove',
    eventName: 'touchmove'
  },
  {
    name: 'onTouchEnd',
    eventName: 'touchend'
  },
  {
    name: 'onTouchCancel',
    eventName: 'touchcancel'
  }
];

if (isMiniApp) {
  baseEvents.push({
    name: 'onLongTap',
    eventName: 'longtap'
  });
} else {
  baseEvents.push({
    name: 'onLongPress',
    eventName: 'longpress'
  });
}

export default baseEvents;
