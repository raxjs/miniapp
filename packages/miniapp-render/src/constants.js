// eslint-disable-next-line import/no-extraneous-dependencies
import { isBaiduSmartProgram, isKuaiShouMiniProgram } from 'universal-env';

export const NATIVE_EVENTS_LIST = [
  'onBack',
  'onKeyboardHeight',
  'onOptionMenuClick',
  'onPopMenuClick',
  'onPullDownRefresh',
  'onPullIntercept',
  'onTitleClick',
  'onTabItemTap',
  'beforeTabItemTap',
  'onResize'
];

export const NATIVE_EVENTS_WITH_RETURN_INFO = ['onShareAppMessage', 'onShareTimeline'];

export const BUILTIN_COMPONENT_LIST = new Set([
  'movable-view', 'cover-image', 'cover-view', 'movable-area', 'scroll-view', 'swiper', 'swiper-item', 'view',
  'icon', 'progress', 'rich-text', 'text',
  'button', 'checkbox', 'checkbox-group', 'editor', 'form', 'input', 'label', 'picker', 'picker-view', 'picker-view-column', 'radio', 'radio-group', 'slider', 'switch', 'textarea',
  'functional-page-navigator', 'navigator',
  'audio', 'camera', 'image', 'live-player', 'live-pusher', 'video',
  'map',
  'canvas',
  'ad', 'official-account', 'open-data', 'web-view', 'open-avatar', 'lottie', 'contact-button'
]);

export const BODY_NODE_ID = 'e-body';

export const INDEX_PAGE = 'index-page';

/**
 * In Baidu SmartProgram and KuaiShou MiniProgram, view and h-element template are modified to support flex, so pure, static and catch elements are omitted
 */

export const STATIC_COMPONENTS = new Set(isBaiduSmartProgram || isKuaiShouMiniProgram ? ['text', 'image'] : ['view', 'text', 'image']); // With no events components

export const PURE_COMPONENTS = new Set(isBaiduSmartProgram || isKuaiShouMiniProgram ? [] : ['view', 'h-element']); // With no events or props && equal to TOUCH_COMPONENTS

export const CATCH_COMPONENTS = new Set(isBaiduSmartProgram || isKuaiShouMiniProgram ? [] : ['view', 'h-element']); // With catchTouchMove events

export const APPEAR_COMPONENT = 'view'; // Without appear event components

export const ANCHOR_COMPONENT = 'scroll-view'; // Components which only use scrollIntoView to scroll

export const COMPONENT_WRAPPER = 'component-wrapper'; // rax-componentwrapper tag

export const NATIVE_TYPES = {
  customComponent: 'customComponent',
  miniappPlugin: 'miniappPlugin',
  componentWrapper: 'componentWrapper'
};
