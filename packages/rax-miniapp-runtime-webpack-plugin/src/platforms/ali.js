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

const StaticView = {
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
};

const PureView = {};

const NoAppearView = {
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
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const NoTouchView = {
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
    ...tapEvents
  }
};

const NoAppearTouchView = {
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
  },
  basicEvents: {
    ...tapEvents
  }
};


const HElement = {
  props: {},
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const NoTouchHElement = {
  props: {},
  basicEvents: {
    ...tapEvents
  }
};


const CatchHElement = Object.assign({}, HElement);

const PureHElement = {};

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

const StaticText = {
  props: {
    selectable: 'false',
    space: '',
    decode: 'false',
    'number-of-lines': ''
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
  events: {
    GetAuthorize: '',
    Error: '',
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

const StaticImage = {
  props: {
    src: '',
    mode: addSingleQuote('scaleToFill'),
    'lazy-load': 'false',
    'default-source': '',
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

const Camera = {
  props: {
    id: '',
    mode: addSingleQuote('normal'),
    'device-position': addSingleQuote('back'),
    flash: addSingleQuote('auto'),
    outputDimension: addSingleQuote('720P'),
    applyMicPermissionWhenInit: 'true',
    'frame-size': addSingleQuote('medium'),
    'frame-format': addSingleQuote('rgba'),
    'max-duration': '30'
  },
  events: {
    Stop: '',
    Error: '',
    ScanCode: ''
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
  StaticView,
  PureView,
  NoAppearView,
  NoTouchView,
  NoAppearTouchView,
  Swiper,
  SwiperItem,
  ScrollView,
  CoverView,
  CoverImage,
  MovableView,
  MovableArea,
  Text,
  StaticText,
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
  StaticImage,
  Video,
  Camera,
  Lottie,
  Canvas,
  Map: MiniappMap,
  WebView,
  OpenAvatar,
  LivePlayer,
  LivePusher,
  ContactButton,
  HElement,
  NoTouchHElement,
  CatchHElement,
  PureHElement,
  HComment
};

exports.derivedComponents = new Map([
  ['CatchView', 'View'],
  ['StaticView', 'View'],
  ['PureView', 'View'],
  ['NoAppearView', 'View'],
  ['NoTouchView', 'View'],
  ['NoAppearTouchView', 'View'],
  ['CatchHElement', 'View'],
  ['PureHElement', 'View'],
  ['NoTouchHElement', 'View'],
  ['HElement', 'View'],
  ['StaticText', 'Text'],
  ['StaticImage', 'Image'],
  ['HComment', 'Block']
]);

exports.controlledComponents = new Set([
  'Input',
  'Checkbox',
  'Picker',
  'PickerView',
  'Radio',
  'Slider',
  'Switch',
  'Textarea'
]);

exports.focusComponents = new Set([
  'Input',
  'Textarea'
]);

exports.voidElements = new Set([
  'HComment'
]);

exports.voidChildrenElements = new Set([
  'Progress',
  'Icon',
  'RichText',
  'Input',
  'Textarea',
  'Checkbox',
  'Radio',
  'Slider',
  'Switch',
  'LivePusher',
  'HComment',
  'Image',
  'Video',
  'Camera',
  'Lottie',
  'Canvas',
  'WebView',
  'LivePlayer',
  'LivePusher',
  'ContactButton',
  'OpenAvatar'
]);


exports.nestElements = new Map([
  ['View', -1],
  ['CoverView', -1],
  ['Text', 6],
  ['Label', 6],
  ['Form', 4],
  ['ScrollView', 4],
  ['Swiper', 4],
  ['SwiperItem', 4]
]);

exports.shouldNotGenerateTemplateComponents = new Set([
  'SwiperItem',
  'PickerViewColumn',
  'MovableView'
]);

exports.needModifyChildrenComponents = {
  Swiper: children => `
    <swiper-item a:for="{{r.children}}" a:key="nodeId">
      <template is="RAX_TMPL_CHILDREN_0" data="{{r: item.children}}" />
    </swiper-item>`,
  MovableArea: children => `
    <movable-view a:for="{{r.children}}" a:key="nodeId" a:if="{{item.nodeType !== 'h-comment'}}" direction="{{item['direction']||'none'}}" inertia="{{tool.a(item['inertia'],false)}}" out-of-bounds="{{tool.a(item['out-of-bounds'],false)}}" x="{{tool.a(item['x'],0)}}" y="{{tool.a(item['y'],0)}}" damping="{{tool.a(item['damping'],20)}}" friction="{{tool.a(item['friction'],2)}}" disabled="{{tool.a(item['disabled'],false)}}" scale="{{tool.a(item['scale'],false)}}" scale-min="{{tool.a(item['scale-min'],0.5)}}" scale-max="{{tool.a(item['scale-max'],10)}}" scale-value="{{tool.a(item['scale-value'],1)}}" animation="{{tool.a(item['animation'],false)}}" onChange="onMovableViewChange" onChangeEnd="onMovableViewChangeEnd" onScale="onMovableViewScale" onTouchStart="onTouchStart" onTouchMove="onTouchMove" onTouchEnd="onTouchEnd" onTouchCancel="onTouchCancel" onLongTap="onLongTap" style="{{item.style}}" class="{{item.class}}" id="{{item.id}}" data-private-node-id="{{item.nodeId}}">
      <template is="RAX_TMPL_CHILDREN_0" data="{{r: item.children}}" />
    </movable-view>`,
  PickerView: children => `
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
  Picker: children => `
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
  eventToLowerCase: false,
  supportSjs: true,
  formatBindedData: (value) => `${value}`
};

exports.sjs = {
  tag: 'import-sjs',
  extension: 'sjs',
  name: 'name',
  from: 'from',
  exportExpression: 'export default'
};
