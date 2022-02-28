// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram, isMiniApp } from 'universal-env';
// Components
import coverImage from './cover-image';
import coverView from './cover-view';
import movableArea from './movable-area';
import scrollView from './scroll-view';
import swiper from './swiper';
import view from './view';
import icon from './icon';
import progress from './progress';
import text from './text';
import richText from './rich-text';
import button from './button';
import editor from './editor';
import form from './form';
import label from './label';
import input from './input';
import radioGroup from './radio-group';
import radio from './radio';
import checkboxGroup from './checkbox-group';
import checkbox from './checkbox';
import picker from './picker';
import pickerView from './picker-view';
import slider from './slider';
import switchCom from './switch';
import textarea from './textarea';
import navigator from './navigator';
import camera from './camera';
import image from './image';
import video from './video';
import lottie from './lottie';
import map from './map';
import canvas from './canvas';
import webView from './web-view';
import livePlayer from './live-player';
import livePusher from './live-pusher';
import officialAccount from './official-account';
import contactButton from './contact-button';

// WeChat only
import adCustom from './ad-custom';

// Alibaba MiniApp only
import lifestyle from './lifestyle';
import lifeFollow from './life-follow';

// Sub components
import movableView from './movable-view';
import swiperItem from './swiper-item';
import pickerViewColumn from './picker-view-column';

let components = [
  coverImage,
  coverView,
  movableArea,
  scrollView,
  swiper,
  view,
  icon,
  progress,
  text,
  richText,
  button,
  editor,
  form,
  label,
  input,
  radioGroup,
  radio,
  checkboxGroup,
  checkbox,
  picker,
  pickerView,
  slider,
  switchCom,
  textarea,
  navigator,
  camera,
  image,
  video,
  map,
  canvas,
  webView,
  livePlayer,
  livePusher,
  movableView,
  swiperItem,
  pickerViewColumn,
  officialAccount,
  contactButton
];

if (isWeChatMiniProgram) {
  components = components.concat([ adCustom ]);
} else if (isMiniApp) {
  components = components.concat([ lifestyle, lifeFollow, lottie ]);
}

const handlesMap = {
  simpleEvents: [],
  singleEvents: [],
  functionalSingleEvents: [],
  complexEvents: []
};

components.forEach(
  ({
    simpleEvents,
    singleEvents,
    functionalSingleEvents,
    complexEvents,
  }) => {
    if (simpleEvents) {
      handlesMap.simpleEvents = handlesMap.simpleEvents.concat(simpleEvents);
    }
    if (singleEvents) {
      handlesMap.singleEvents = handlesMap.singleEvents.concat(singleEvents);
    }
    if (functionalSingleEvents) {
      handlesMap.functionalSingleEvents = handlesMap.functionalSingleEvents.concat(
        functionalSingleEvents
      );
    }
    if (complexEvents) {
      handlesMap.complexEvents = handlesMap.complexEvents.concat(complexEvents);
    }
  }
);

export { handlesMap };
