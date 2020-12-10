// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';

const livePusher = {
  name: 'live-pusher',
  singleEvents: [{
    name: 'onLivePusherStateChange',
    eventName: 'statechange'
  }, {
    name: 'onLivePusherError',
    eventName: 'error'
  }, {
    name: 'onLivePusherNetStatus',
    eventName: 'netstatus'
  }]
};

if (isWeChatMiniProgram) {
  livePusher.singleEvents = livePusher.singleEvents.concat([
    {
      name: 'onLivePusherBgmStart',
      eventName: 'bgmstart'
    },
    {
      name: 'onLivePusherBgmProgress',
      eventName: 'bgmprogress'
    },
    {
      name: 'onLivePusherBgmComplete',
      eventName: 'bgmcomplete'
    },
    {
      name: 'onLivePusherAudioVolumeNofify',
      eventName: 'audiovolumenotify'
    }]);
}
export default livePusher;
