// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

const view = {
  name: 'view'
};

if (isMiniApp) {
  view.simpleEvents = [{
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
  },
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
  }];
}

export default view;
