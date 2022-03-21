// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

const movableView = {
  name: 'movable-view',
  singleEvents: [{
    name: 'onMovableViewHtouchmove',
    eventName: 'htouchmove'
  },
  {
    name: 'onMovableViewVtouchmove',
    eventName: 'vtouchmove'
  }],
  functionalSingleEvents: [
    {
      name: 'onMovableViewChange',
      eventName: 'change',
      middleware(evt, domNode) {
        domNode._setAttributeWithDelayUpdate('x', evt.detail.x);
        domNode._setAttributeWithDelayUpdate('y', evt.detail.y);
      }
    },
    {
      name: 'onMovableViewScale',
      eventName: 'scale',
      middleware(evt, domNode) {
        domNode._setAttributeWithDelayUpdate('x', evt.detail.x);
        domNode._setAttributeWithDelayUpdate('y', evt.detail.y);
        domNode._setAttributeWithDelayUpdate('scale-value', evt.detail.scale);
      }
    }
  ]
};

if (isMiniApp) {
  movableView.functionalSingleEvents.push({
    name: 'onMovableViewChangeEnd',
    eventName: 'changeend',
    middleware(evt, domNode) {
      domNode._setAttributeWithDelayUpdate('x', evt.detail.x);
      domNode._setAttributeWithDelayUpdate('y', evt.detail.y);
    }
  });
}

export default movableView;
