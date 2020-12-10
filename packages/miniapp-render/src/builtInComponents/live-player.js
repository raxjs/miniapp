// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';

const livePlayer = {
  name: 'live-player',
  singleEvents: [{
    name: 'onLivePlayerStateChange',
    eventName: 'statechange'
  }, {
    name: 'onLivePlayerFullScreenChange',
    eventName: 'fullscreenchange'
  }]
};

if (isWeChatMiniProgram) {
  livePlayer.singleEvents = livePlayer.singleEvents.concat([
    {
      name: 'onLivePlayerNetStatus',
      eventName: 'netstatus'
    },
    {
      name: 'onLivePlayerAudioVolumeNofify',
      eventName: 'audiovolumenotify'
    },
    {
      name: 'onLivePlayerEnterPictureInPicture',
      eventName: 'enterpictureinpicture'
    },
    {
      name: 'onLivePlayerLeavePictureInPicture',
      eventName: 'leavepictureinpicture'
    }]);
}
if (isMiniApp) {
  livePlayer.singleEvents = livePlayer.singleEvents.concat([
    {
      name: 'onLivePlayerError',
      eventName: 'error'
    },
    {
      name: 'onLiverPlayerUserAction',
      eventName: 'useraction'
    }]);
}
export default livePlayer;
