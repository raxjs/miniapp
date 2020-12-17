// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

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
} else {
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

export default livePlayer;
