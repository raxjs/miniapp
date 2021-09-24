// eslint-disable-next-line import/no-extraneous-dependencies
import { isBaiduSmartProgram } from 'universal-env';

const ad = {
  name: 'ad',
  singleEvents: [{
    name: 'onAdLoad',
    eventName: 'load'
  },
  {
    name: 'onAdError',
    eventName: 'error'
  },
  {
    name: 'onAdClose',
    eventName: 'close'
  }]
};

if (isBaiduSmartProgram) {
  ad.singleEvents.push({
    name: 'onAdStatus',
    eventName: 'status'
  });
}

export default ad;
