const addSingleQuote = require('../utils/addSingleQuote');

const tapEvents = {
  Tap: ''
};


const touchEvents = {
  TouchStart: '',
  TouchMove: '',
  TouchCancel: '',
  TouchEnd: '',
  LongTap: ''
};

const animationEvents = {
  TransitionEnd: '',
  AnimationStart: '',
  AnimationIteration: '',
  AnimationEnd: ''
};

const View = {
  props: {
    'hover-class': addSingleQuote('none'),
    'hover-start-time': '50',
    'hover-stay-time': '400',
    'hover-stop-propagation': 'false',
  },
  events: {
    ...animationEvents
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const HElement = {
  props: {},
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const HComment = {};

const Swiper = {
  props: {
    'indicator-dots': 'false',
    'indicator-color': addSingleQuote('rgba(0, 0, 0, .3)'),
    'indicator-active-color': addSingleQuote('#000'),
    'active-class': '',
    'changing-class': '',
    autoplay: 'false',
    current: '0',
    duration: '500',
    interval: '5000',
    circular: 'false',
    vertical: 'false',
    'previous-margin': addSingleQuote('0px'),
    'next-margin': addSingleQuote('0px'),
    'snap-to-edge': 'false',
    'display-multiple-items': '1',
    'easing-function': addSingleQuote('default')
  },
  events: {
    Change: '',
    Transition: '',
    AnimationFinish: ''
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const SwiperItem = {};

const ScrollView = {
  props: {
    'scroll-x': 'false',
    'scroll-y': 'false',
    'upper-threshold': '50',
    'lower-threshold': '50',
    'scroll-top': '',
    'scroll-left': '',
    'scroll-into-view': '',
    'scroll-with-animation': 'false',
    'enable-back-to-top': 'false',
    'enable-flex': 'false',
    'scroll-anchoring': 'false',
    'refresher-enabled': 'false',
    'refresher-threshold': '45',
    'refresher-default-style': addSingleQuote('black'),
    'refresher-background': addSingleQuote('#FFF'),
    'refresher-triggered': 'false',
    enhanced: 'false',
    bounces: 'true',
    'show-scrollbar': 'true',
    'paging-enabled': 'false',
    'fast-deceleration': 'false',
  },
  events: {
    DragStart: '',
    Dragging: '',
    DragEnd: '',
    ScrollToUpper: '',
    ScrollToLower: '',
    Scroll: '',
    RefresherPulling: '',
    RefresherRefresh: '',
    RefresherRestore: '',
    RefresherAbort: ''
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const CoverView = {
  props: {},
  basicEvents: {
    ...tapEvents
  }
};

const CoverImage = {
  props: {
    src: ''
  },
  basicEvents: {
    ...tapEvents
  }
};

const MovableArea = {
  props: {
    'scale-area': 'false'
  },
  basicEvents: {
    ...tapEvents
  }
};

const MovableView = {
  props: {
    direction: addSingleQuote('none'),
    inertia: 'false',
    'out-of-bounds': 'false',
    x: '0',
    y: '0',
    damping: '20',
    friction: '2',
    disabled: 'false',
    scale: 'false',
    'scale-min': '0.5',
    'scale-max': '10',
    'scale-value': '1',
    animation: 'false',
  },
  events: {
    Change: '',
    ChangeEnd: '',
    Scale: ''
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const Text = {
  props: {
    selectable: 'false',
    space: '',
    decode: 'false',
    'number-of-lines': ''
  },
  basicEvents: {
    ...tapEvents
  }
};

const Icon = {
  props: {
    type: '',
    size: '23',
    color: ''
  },
  basicEvents: {
    ...tapEvents
  }
};

const Progress = {
  props: {
    percent: '',
    'show-info': '',
    'stroke-width': '6',
    active: 'false',
    'background-color': '',
    'active-color': addSingleQuote('#09BB07')
  }
};

const RichText = {
  props: {
    nodes: '[]'
  },
  basicEvents: {
    ...tapEvents
  }
};

const Button = {
  props: {
    size: addSingleQuote('default'),
    type: addSingleQuote('default'),
    plain: 'false',
    disabled: 'false',
    loading: 'false',
    'hover-class': addSingleQuote('button-hover'),
    'hover-start-time': '20',
    'hover-stay-time': '70',
    'hover-stop-propagation': 'false',
    'form-type': '',
    'open-type': '',
    scope: '',
    'public-id': ''
  },
  basicEvents: {
    ...tapEvents
  }
};

const Form = {
  props: {
    'report-submit': '',
  },
  events: {
    Submit: '',
    Reset: ''
  }

};

const Label = {
  props: {
    for: ''
  },
  basicEvents: {
    ...tapEvents
  }
};

const Input = {
  props: {
    value: '',
    name: '',
    type: addSingleQuote('text'),
    password: 'false',
    placeholder: '',
    'placeholder-style': '',
    'placeholder-class': '',
    disabled: 'false',
    maxlength: '140',
    focus: 'false',
    'confirm-type': addSingleQuote('done'),
    'confirm-hold': 'false',
    cursor: '',
    'selection-start': '-1',
    'selection-end': '-1',
    'random-number': 'false',
    controlled: 'false',
  },
  events: {
    Input: '',
    Confirm: '',
    Focus: '',
    Blur: ''
  }

};

const Textarea = {
  props: {
    value: '',
    name: '',
    placeholder: '',
    'placeholder-style': '',
    'placeholder-class': '',
    disabled: 'false',
    maxlength: '140',
    focus: 'false',
    'auto-height': 'false',
    'show-count': 'true',
    controlled: 'false',
  },
  events: {
    Input: '',
    Confirm: '',
    Focus: '',
    Blur: ''
  }
};

const Radio = {
  props: {
    value: '',
    checked: 'false',
    disabled: 'false',
    color: ''
  },
  events: {}
};

const RadioGroup = {
  props: {
    name: '',
  },
  events: {
    Change: ''
  }
};

const Checkbox = {
  props: {
    value: '',
    checked: 'false',
    disabled: 'false',
    color: '',
  },
  events: {
    Change: ''
  }
};

const CheckboxGroup = {
  props: {
    name: ''
  },
  events: {
    Change: ''
  }
};

const Switch = {
  props: {
    value: '',
    checked: 'false',
    disabled: 'false',
    color: '',
    controlled: 'false',
  },
  events: {
    Change: ''
  }
};

const Slider = {
  props: {
    name: '',
    min: '0',
    max: '100',
    step: '1',
    disabled: 'false',
    value: '0',
    'show-value': 'false',
    'active-color': addSingleQuote('#108ee9'),
    'background-color': addSingleQuote('#ddd'),
    'track-size': '4',
    'handle-size': '22',
    'handle-color': addSingleQuote('#fff'),
  },
  events: {
    Change: ''
  }
};

const PickerView = {
  props: {
    value: '',
    'indicator-style': '',
    'indicator-class': '',
    'mask-style': '',
    'mask-class': '',
  },
  events: {
    Change: ''
  }
};

const PickerViewColumn = {};

const Picker = {
  props: {
    disabled: 'false',
    range: '[]',
    'range-key': '',
    value: '',
    title: '',
  },
  events: {
    Change: '',
  },
};

const Navigator = {
  props: {
    url: '',
    'open-type': addSingleQuote('navigate'),
    'hover-class': addSingleQuote('none'),
    'hover-start-time': '',
    'hover-stay-time': ''
  },
  events: {}
};

const Image = {
  props: {
    src: '',
    mode: addSingleQuote('scaleToFill'),
    'lazy-load': 'false',
    'default-source': '',
  },
  events: {
    Load: '',
    Error: ''
  }
};

const Video = {
  props: {
    src: '',
    poster: '',
    'poster-size': '',
    'object-fit': addSingleQuote('contain'),
    'initial-time': '',
    duration: '',
    controls: 'true',
    autoplay: 'false',
    direction: '',
    loop: 'false',
    muted: 'false',
    'show-fullscreen-btn': 'true',
    'show-play-btn': 'true',
    'show-center-play-btn': 'true',
    'show-mute-btn': 'true',
    'show-thin-progress-bar': 'false',
    'enable-progress-gesture': 'false',
    'mobilenet-hint-type': '1',
    'floating-mode': addSingleQuote('none'),
  },
  events: {
    Play: '',
    Pause: '',
    Ended: '',
    TimeUpdate: '',
    Loading: '',
    Error: '',
    FullScreenChange: '',
    UserAction: '',
    Stop: '',
    RenderStart: ''
  }
};

const Canvas = {
  props: {
    width: addSingleQuote('300px'),
    height: addSingleQuote('225px'),
    'disable-scroll': 'false',
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const MiniappMap = {
  props: {
    longitude: '',
    latitude: '',
    scale: '16',
    'min-scale': '3',
    'max-scale': '20',
    markers: '',
    covers: '',
    polyline: '',
    circles: '',
    controls: '',
    'include-points': '',
    'show-location': 'false',
    polygons: '',
    subkey: '',
    'layer-style': '1',
    rotate: '0',
    skew: '0',
    'enable-3D': 'false',
    'show-compass': 'false',
    'show-scale': 'false',
    'enable-overlooking': 'false',
    'enable-zoom': 'true',
    'enable-scroll': 'true',
    'enable-rotate': 'false',
    'enable-satellite': 'false',
    'enable-traffic': 'false',
    'enable-poi': '',
    'enable-building': '',
    setting: '',
  },
  events: {
    MarkerTap: '',
    ControlTap: '',
    CalloutTap: '',
    RegionChange: '',
    PanelTap: '',
  }

};

const WebView = {
  props: {
    src: '',
  },
  events: {
    Message: '',
    Load: '',
    Error: ''
  }
};

const OpenAvatar = {
  props: {
    userId: '',
    openId: '',
    nickName: '',
    avatar: '',
    size: addSingleQuote('normal')
  },
  basicEvents: {
    ...tapEvents
  }

};

const LivePlayer = {
  props: {
    src: '',
    mode: addSingleQuote('live'),
    autoplay: 'false',
    muted: 'false',
    orientation: addSingleQuote('vertical'),
    'object-fit': addSingleQuote('contain'),
    'min-cache': '1',
    'max-cache': '3',
    'floating-mode': addSingleQuote('none'),
  },
  events: {
    StateChange: '',
    Error: '',
    FullScreenChange: '',
    UserAction: ''
  }

};

const LivePusher = {
  props: {
    url: '',
    mode: addSingleQuote('SD'),
    autoFocus: 'true',
    muted: 'false',
    orientation: addSingleQuote('vertical'),
    autopush: 'true',
    beauty: '0',
    devicePosition: addSingleQuote('front'),
    backgroundMute: 'false',
    'local-mirror': addSingleQuote('auto'),
    'remote-mirror': 'false',
  },
  events: {
    StateChange: '',
    Error: '',
    NetStatus: ''
  }

};

exports.internalComponents = {
  View,
  Swiper,
  SwiperItem,
  ScrollView,
  CoverView,
  CoverImage,
  MovableView,
  MovableArea,
  Text,
  Icon,
  Progress,
  RichText,
  Button,
  Form,
  Label,
  Input,
  Textarea,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Switch,
  Slider,
  PickerView,
  PickerViewColumn,
  Picker,
  Navigator,
  Image,
  Video,
  Canvas,
  Map: MiniappMap,
  WebView,
  OpenAvatar,
  LivePlayer,
  LivePusher,
  HElement,
  HComment
};

exports.derivedComponents = new Map([
  ['h-element', 'view'],
  ['h-comment', 'block']
]);

exports.controlledComponents = new Set([
  'input',
  'checkbox',
  'picker',
  'picker-view',
  'radio',
  'slider',
  'switch',
  'textarea'
]);

exports.focusComponents = new Set([
  'input',
  'textarea'
]);

exports.voidElements = new Set([
  'h-comment'
]);

exports.voidChildrenElements = new Set([
  'progress',
  'icon',
  'rich-text',
  'input',
  'textarea',
  'slider',
  'switch',
  'live-pusher',
  'h-comment',
  'open-avatar',
  'web-view',
  'live-player',
  'live-pusher'
]);

exports.nestElements = new Map([
  ['view', -1],
  ['cover-view', -1],
  ['text', 6],
  ['label', 6],
  ['form', 4],
  ['scroll-view', 4],
  ['swiper', 4],
  ['swiper-item', 4]
]);

exports.shouldNotGenerateTemplateComponents = new Set([
  'swiper-item',
  'picker-view-column',
  'movable-view'
]);

exports.needModifyChildrenComponents = {
  swiper: (children, level) => `
<swiper-item wx:for="{{r.children}}" wx:if="{{item.nodeType !== 'h-comment'}}" wx:key="nodeId">
  <template is="{{tool.c(cid + 1)}}" data="{{r: item.children, c: tool.e(c, 'swiper'), cid: ${level}}}" />
</swiper-item>`,
  'movable-area': children => `
<movable-view wx:for="{{r.children}}" wx:key="nodeId" wx:if="{{item.nodeType !== 'h-comment'}}" direction="{{r['direction']||'none'}}" inertia="{{tool.a(r['inertia'],false)}}" out-of-bounds="{{tool.a(r['out-of-bounds'],false)}}" x="{{tool.a(r['x'],0)}}" y="{{tool.a(r['y'],0)}}" damping="{{tool.a(r['damping'],20)}}" friction="{{tool.a(r['friction'],2)}}" disabled="{{tool.a(r['disabled'],false)}}" scale="{{tool.a(r['scale'],false)}}" scale-min="{{tool.a(r['scale-min'],0.5)}}" scale-max="{{tool.a(r['scale-max'],10)}}" scale-value="{{tool.a(r['scale-value'],1)}}" animation="{{tool.a(r['animation'],true)}}" bindchange="onMovableViewChange" bindscale="onMovableViewScale" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindlongtap="onLongTap" bindtap="onTap" style="{{r.style}}" class="{{r.class}}" id="{{r.id}}" data-private-node-id="{{r.nodeId}}">${children}
</movable-view>`,
  'scroll-view': children => `
<block wx:for="{{r.children}}" wx:key="nodeId">
  <block wx:if="{{item.nodeId}}">
    <template is="{{tool.d(item.nodeType, c)}}" data="{{r: item, c: c, cid: cid + 1}}" />
  </block>
  <block wx:else>
    <block>{{item.content}}</block>
  </block>
</block>
  `,
  'picker-view': children => `
<picker-view-column wx:for="{{r.children}}" wx:key="nodeId" wx:if="{{item.nodeType !== 'h-comment'}}">
  ${children}
</picker-view-column>`,
  picker: children => `<view>${children}</view>`
};

exports.adapter = {
  if: 'wx:if',
  else: 'wx:else',
  elseif: 'wx:elif',
  for: 'wx:for',
  forItem: 'wx:for-item',
  forIndex: 'wx:for-index',
  key: 'wx:key',
  xs: 'wxs',
  event: 'bind',
  eventToLowerCase: true
};


exports.sjs = {
  tag: 'wxs',
  extension: 'wxs',
  name: 'module',
  from: 'src',
  exportExpression: 'module.exports ='
};