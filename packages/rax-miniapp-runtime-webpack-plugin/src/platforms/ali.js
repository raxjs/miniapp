const addSingleQuote = require('../utils/addSingleQuote');

const tapEvents = {
  Tap: ''
};


const touchEvents = {
  TouchStart: '',
  TouchMove: '',
  TouchEnd: '',
  TouchCancel: '',
  LongTap: ''
};

const View = {
  props: {
    'disable-scroll': 'false',
    'hover-class': '',
    'hover-start-time': '',
    'hover-stay-time': '',
    hidden: 'false',
    'hover-stop-propagation': 'false',
    role: '',
    animation: 'null',
  },
  events: {
    TransitionEnd: '',
    AnimationIteration: '',
    AnimationStart: '',
    AnimationEnd: '',
    Appear: '',
    Disappear: '',
    FirstAppear: '',
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const CatchView = Object.assign({}, View);

const HElement = {
  props: {
    animation: 'null',
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const CatchHElement = Object.assign({}, HElement);

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
    acceleration: 'false',
    'disable-programmatic-animation': 'false',
    'disable-touch': 'false',
    'swipe-ratio': 'false',
    'swipe-speed': '0.05',
    'touch-angle': '45',
  },
  events: {
    Change: '',
    Transition: '',
    AnimationEnd: ''
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
    'scroll-animation-duration': '',
    'enable-back-to-top': 'false',
    'trap-scroll': 'false',
  },
  events: {
    ScrollToUpper: '',
    ScrollToLower: '',
    Scroll: ''
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
    'public-id': '',
    'data-params': '' // For share button
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
    enableNative: 'true'
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
    enableNative: 'true'
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
  basicEvents: {
    ...tapEvents
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

const Lottie = {
  props: {
    autoplay: 'false',
    path: '',
    speed: '1.0',
    repeatCount: '0',
    autoReverse: 'false',
    assetsPath: '',
    placeholder: '',
    djangoId: '',
    md5: '',
    optimize: 'false'
  }
};

const Canvas = {
  props: {
    width: addSingleQuote('300px'),
    height: addSingleQuote('225px'),
    'disable-scroll': 'false',
  },
  events: {
    ...touchEvents,
  },
  basicEvents: {
    ...tapEvents,
  }
};

const MiniappMap = {
  props: {
    longitude: '',
    latitude: '',
    scale: '16',
    skew: '0',
    rotate: '0',
    markers: '[]',
    polyline: '[]',
    circles: '[]',
    controls: '[]',
    polygons: '[]',
    'show-location': '',
    'include-points': '[]',
    'include-padding': '{}',
    'ground-overlays': '[]',
    'tile-overlay': '{}',
    'custom-map-style': '',
    panels: '[]',
    setting: '{}',
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

const ContactButton = {
  props: {
    'tnt-inst-id': '',
    scene: '',
    size: '25',
    color: addSingleQuote('#00A3FF'),
    icon: '',
    'alipay-card-no': '',
    'ext-info': ''
  }
};

exports.internalComponents = {
  View,
  CatchView,
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
  Lottie,
  Canvas,
  Map: MiniappMap,
  WebView,
  OpenAvatar,
  LivePlayer,
  LivePusher,
  ContactButton,
  HElement,
  CatchHElement,
  HComment
};

exports.derivedComponents = new Map([
  ['catch-view', 'view'],
  ['catch-h-element', 'view'],
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
  'image',
  'video',
  'lottie',
  'canvas',
  'live-player',
  'live-pusher',
  'contact-button'
]);

exports.nestElements = new Map([
  ['view', -1],
  ['cover-view', -1],
  // ['block', -1],
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
  swiper: children => `
    <swiper-item a:for="{{r.children}}" a:key="nodeId">
      <template is="RAX_TMPL_CHILDREN_0" data="{{r: item.children}}" />
    </swiper-item>`,
  'movable-area': children => `
    <movable-view a:for="{{r.children}}" a:key="nodeId" a:if="{{item.nodeType !== 'h-comment'}}" direction="{{item['direction']||'none'}}" inertia="{{tool.a(item['inertia'],false)}}" out-of-bounds="{{tool.a(item['out-of-bounds'],false)}}" x="{{tool.a(item['x'],0)}}" y="{{tool.a(item['y'],0)}}" damping="{{tool.a(item['damping'],20)}}" friction="{{tool.a(item['friction'],2)}}" disabled="{{tool.a(item['disabled'],false)}}" scale="{{tool.a(item['scale'],false)}}" scale-min="{{tool.a(item['scale-min'],0.5)}}" scale-max="{{tool.a(item['scale-max'],10)}}" scale-value="{{tool.a(item['scale-value'],1)}}" animation="{{tool.a(item['animation'],false)}}" onChange="onMovableViewChange" onChangeEnd="onMovableViewChangeEnd" onScale="onMovableViewScale" onTouchStart="onTouchStart" onTouchMove="onTouchMove" onTouchEnd="onTouchEnd" onTouchCancel="onTouchCancel" onLongTap="onLongTap" style="{{item.style}}" class="{{item.class}}" id="{{item.id}}" data-private-node-id="{{item.nodeId}}">
      <template is="RAX_TMPL_CHILDREN_0" data="{{r: item.children}}" />
    </movable-view>`,
  'picker-view': children => `
    <picker-view-column a:for="{{r.children}}" a:key="nodeId" a:if="{{item.nodeType !== 'h-comment'}}">
      <view a:for="{{item.children}}" a:for-item="pickerColumnItem">
        <block a:if="{{pickerColumnItem.nodeId}}">
          <template is="{{tool.c(pickerColumnItem.nodeType)}}" data="{{r: pickerColumnItem}}" />
        </block>
        <block a:else>
          <block>{{pickerColumnItem.content}}</block>
        </block>
      </view>
    </picker-view-column>`,
  picker: children => `
    <view>
      ${children}
    </view>`
};

exports.adapter = {
  if: 'a:if',
  else: 'a:else',
  elseif: 'a:elif',
  for: 'a:for',
  forItem: 'a:for-item',
  forIndex: 'a:for-index',
  key: 'a:key',
  xs: 'sjs',
  event: 'on',
  catchEvent: 'catch',
  eventToLowerCase: false
};

exports.sjs = {
  tag: 'import-sjs',
  extension: 'sjs',
  name: 'name',
  from: 'from',
  exportExpression: 'export default'
};
