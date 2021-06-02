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

export const STATIC_COMPONENTS = new Set(['view', 'text', 'image']); // With no events components

export const PURE_COMPONENTS = new Set(['view', 'h-element']); // With no events or props && equal to TOUCH_COMPONENTS

export const CATCH_COMPONENTS = new Set(['view', 'h-element']); // With catchTouchMove events

export const APPEAR_COMPONENT = 'view'; // Without appear event components

export const ANCHOR_COMPONENT = 'scroll-view'; // Components which only use scrollIntoView to scroll
