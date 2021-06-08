// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

const swiper = {
  name: 'swiper',
  singleEvents: [{
    name: 'onSwiperTransition',
    eventName: 'transition'
  }],
  functionalSingleEvents: [
    {
      name: 'onSwiperChange',
      eventName: 'change',
      middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('current', evt.detail.current);
      }
    }
  ]
};

if (isMiniApp) {
  swiper.singleEvents.push({
    name: 'onSwiperAnimationEnd',
    eventName: 'animationEnd'
  });
} else {
  swiper.singleEvents.push({
    name: 'onSwiperAnimationFinish',
    eventName: 'animationfinish'
  });
}

export default swiper;
