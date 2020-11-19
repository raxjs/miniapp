// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';

const ScrollView = {
  name: 'scroll-view',
  singleEvents: [{
    name: 'onScrollViewScrollToUpper',
    eventName: 'scrolltoupper'
  },
  {
    name: 'onScrollViewScrollToLower',
    eventName: 'scrolltolower'
  }],
  functionalSingleEvents: [
    {
      name: 'onScrollViewScroll',
      eventName: 'scroll',
      middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('scroll-into-view', '');
        domNode._setAttributeWithOutUpdate('scroll-top', evt.detail.scrollTop);
        domNode._setAttributeWithOutUpdate('scroll-left', evt.detail.scrollLeft);
      }
    }
  ]
};

if (isWeChatMiniProgram) {
  ScrollView.singleEvents = ScrollView.singleEvents.concat([
    {
      name: 'onScrollViewRefresherPulling',
      eventName: 'refresherpulling'
    },
    {
      name: 'onScrollViewRefresherRefresh',
      eventName: 'refresherrefresh'
    },
    {
      name: 'onScrollViewRefresherRestore',
      eventName: 'refresherrestore'
    },
    {
      name: 'onScrollViewRefresherAbort',
      eventName: 'refresherabort'
    },
  ]);
}

export default ScrollView;
