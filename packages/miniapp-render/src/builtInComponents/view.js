// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

const view = {
  name: 'view',
  simpleEvents: [
    {
      name: 'onViewTransitionEnd',
      eventName: 'transitionend'
    },
    {
      name: 'onViewAnimationIteration',
      eventName: 'animationiteration'
    },
    {
      name: 'onViewAnimationStart',
      eventName: 'animationstart'
    },
    {
      name: 'onViewAnimationEnd',
      eventName: 'animationend'
    }
  ]
};

if (isMiniApp) {
  view.simpleEvents = view.simpleEvents.concat[{
    name: 'onViewAppear',
    eventName: 'appear'
  },
  {
    name: 'onViewFirstAppear',
    eventName: 'firstappear'
  },
  {
    name: 'onViewDisappear',
    eventName: 'disappear'
  }];
}

export default view;
