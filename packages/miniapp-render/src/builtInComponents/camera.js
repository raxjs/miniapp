// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';

const camera = {
  name: 'camera',
  singleEvents: [{
    name: 'onCameraStop',
    eventName: 'stop'
  },
  {
    name: 'onCameraError',
    eventName: 'error'
  },
  {
    name: 'onCameraScanCode',
    eventName: 'scancode'
  }]
};

if (isWeChatMiniProgram) {
  camera.singleEvents = camera.singleEvents.concat([{
    name: 'onCameraInitDone',
    eventName: 'initdone'
  }]);
}

export default camera;
