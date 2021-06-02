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
    animation: ''
  },
  events: {
    ...animationEvents
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const CatchView = Object.assign({}, View);

const StaticView = {
  props: {
    'hover-class': addSingleQuote('none'),
    'hover-start-time': '50',
    'hover-stay-time': '400',
    'hover-stop-propagation': 'false',
    animation: ''
  }
};

const PureView = {};

const NoTouchView = {
  props: {
    'hover-class': addSingleQuote('none'),
    'hover-start-time': '50',
    'hover-stay-time': '400',
    'hover-stop-propagation': 'false',
    animation: ''
  },
  events: {
    ...animationEvents
  },
  basicEvents: {
    ...tapEvents
  }
};

const HElement = {
  props: {
    animation: ''
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const CatchHElement = Object.assign({}, HElement);

const PureHElement = {};

const NoTouchHElement = {
  props: {
    animation: ''
  },
  basicEvents: {
    ...tapEvents
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
  basicEvents: {}
};

const CoverView = {
  props: {
    'scroll-top': ''
  },
  basicEvents: {
    ...tapEvents
  }
};

const CoverImage = {
  props: {
    src: ''
  },
  events: {
    Load: '',
    Error: ''
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
    x: '',
    y: '',
    damping: '20',
    friction: '2',
    disabled: 'false',
    scale: 'false',
    'scale-min': '0.5',
    'scale-max': '10',
    'scale-value': '1',
    animation: 'true',
  },
  events: {
    Change: '',
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
    'border-radius': '0',
    'font-size': '16',
    'stroke-width': '6',
    color: addSingleQuote('#09BB07'),
    activeColor: addSingleQuote('#09BB07'),
    backgroundColor: addSingleQuote('#EBEBEB'),
    active: 'false',
    'active-mode': addSingleQuote('backwards'),
    duration: '30',
  },
  events: {
    activeEnd: ''
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
    'form-type': '',
    'open-type': '',
    'hover-class': addSingleQuote('button-hover'),
    'hover-stop-propagation': 'false',
    'hover-start-time': '20',
    'hover-stay-time': '70',
    lang: addSingleQuote('en'),
    'session-from': '',
    'send-message-title': '',
    'send-message-path': '',
    'send-message-img': '',
    'app-parameter': '',
    'show-message-card': 'false',
    'data-params': '' // For share button
  },
  events: {
    GetUserInfo: '',
    Contact: '',
    GetPhoneNumber: '',
    Error: '',
    OpenSetting: '',
    LaunchApp: ''
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const Form = {
  props: {
    'report-submit': '',
    'report-submit-timeout': '0'
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
    type: addSingleQuote('text'),
    password: 'false',
    placeholder: '',
    'placeholder-style': '',
    'placeholder-class': addSingleQuote('input-placeholder'),
    disabled: 'false',
    maxlength: '140',
    'cursor-spacing': '0',
    focus: 'false',
    'confirm-type': addSingleQuote('done'),
    'always-embed': 'false',
    'confirm-hold': 'false',
    cursor: '-1',
    'selection-start': '-1',
    'selection-end': '-1',
    'adjust-position': 'true',
    'hold-keyboard': 'false',
  },
  events: {
    Input: '',
    Confirm: '',
    Focus: '',
    Blur: '',
    KeyboardHeightChange: ''
  }

};

const Textarea = {
  props: {
    value: '',
    placeholder: '',
    'placeholder-style': '',
    'placeholder-class': addSingleQuote('textarea-placeholder'),
    disabled: 'false',
    maxlength: '140',
    focus: 'false',
    'auto-height': 'false',
    fixed: 'false',
    'cursor-spacing': '0',
    cursor: '-1',
    'show-confirm-bar': 'true',
    'selection-start': '-1',
    'selection-end': '-1',
    'adjust-position': 'true',
    'hold-keyboard': 'false',
    'disable-default-padding': 'false',
    'confirm-type': addSingleQuote('return')
  },
  events: {
    Input: '',
    Confirm: '',
    Focus: '',
    Blur: '',
    LineChange: '',
    KeyboardHeightChange: ''
  }
};

const Radio = {
  props: {
    value: '',
    checked: 'false',
    disabled: 'false',
    color: addSingleQuote('#09BB07')
  },
  events: {}
};

const RadioGroup = {
  props: {},
  events: {
    Change: ''
  }
};

const Checkbox = {
  props: {
    value: '',
    checked: 'false',
    disabled: 'false',
    color: addSingleQuote('#09BB07')
  },
  events: {
    Change: ''
  }
};

const CheckboxGroup = {
  props: {},
  events: {
    Change: ''
  }
};

const Switch = {
  props: {
    checked: 'false',
    disabled: 'false',
    type: addSingleQuote('switch'),
    color: addSingleQuote('#04BE02'),
    controlled: 'false',
  },
  events: {
    Change: ''
  }
};

const Editor = {
  props: {
    'read-only': 'false',
    placeholder: '',
    'show-img-size': 'false',
    'show-img-toolbar': 'false',
    'show-img-resize': 'false',
  },
  events: {
    Ready: '',
    Focus: '',
    Blur: '',
    Input: '',
    StatusChange: ''
  }
};

const Slider = {
  props: {
    min: '0',
    max: '100',
    step: '1',
    disabled: 'false',
    value: '0',
    color: addSingleQuote('#e9e9e9'),
    'selected-color': addSingleQuote('#1aad19'),
    activeColor: addSingleQuote('#1aad19'),
    activeColor: addSingleQuote('#1aad19'),
    backgroundColor: addSingleQuote('#e9e9e9'),
    'block-size': '28',
    'block-color': addSingleQuote('#fff'),
    'show-value': 'false'
  },
  events: {
    Change: '',
    Changing: ''
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
    Change: '',
    PickStart: '',
    PickEnd: ''
  }
};

const PickerViewColumn = {};

const Picker = {
  props: {
    'header-text': '',
    disabled: 'false',
    mode: addSingleQuote('selector'),
    range: '[]',
    'range-key': '',
    value: '',
    start: '',
    end: '',
    fields: '',
    'custom-item': ''
  },
  events: {
    Change: '',
    Cancel: '',
    ColumnChange: ''
  },
};

const Navigator = {
  props: {
    target: addSingleQuote('self'),
    url: '',
    'open-type': addSingleQuote('navigate'),
    delta: '1',
    'app-id': '',
    path: '',
    'extra-data': '',
    version: addSingleQuote('release'),
    'hover-class': addSingleQuote('navigator-hover'),
    'hover-stop-propagation': 'false',
    'hover-start-time': '',
    'hover-stay-time': ''
  },

  events: {
    Success: '',
    Fail: '',
    Complete: ''
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const Image = {
  props: {
    src: '',
    mode: addSingleQuote('scaleToFill'),
    webp: 'false',
    'lazy-load': 'false',
    'show-menu-by-longpress': 'false',
  },
  events: {
    Load: '',
    Error: ''
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const StaticImage = {
  props: {
    src: '',
    mode: addSingleQuote('scaleToFill'),
    webp: 'false',
    'lazy-load': 'false',
    'show-menu-by-longpress': 'false',
  }
};

const Video = {
  props: {
    src: '',
    duration: '',
    controls: 'true',
    'danmu-list': '',
    'danmu-btn': 'false',
    'enable-danmu': 'false',
    autoplay: 'false',
    loop: 'false',
    muted: 'false',
    'initial-time': '0',
    'page-gesture': 'false',
    direction: '',
    'show-progress': 'true',
    'show-fullscreen-btn': 'true',
    'show-play-btn': 'true',
    'show-center-play-btn': 'true',
    'enable-progress-gesture': 'true',
    'object-fit': addSingleQuote('contain'),
    poster: '',
    'show-mute-btn': 'false',
    title: '',
    'play-btn-position': addSingleQuote('bottom'),
    'enable-play-gesture': 'false',
    'auto-pause-if-navigate': 'true',
    'auto-pause-if-open-native': 'true',
    'vslide-gesture': 'false',
    'vslide-gesture-in-fullscreen': 'true',
    'ad-unit-id': '',
    'poster-for-crawler': '',
    'show-casting-button': 'false',
    'picture-in-picture-mode': '',
    'picture-in-picture-show-progress': 'false',
    'enable-auto-rotation': 'false',
    'show-screen-lock-button': 'false',
    'show-snapshot-button': 'false'
  },
  events: {
    Play: '',
    Pause: '',
    Ended: '',
    TimeUpdate: '',
    ScreenChange: '',
    Waiting: '',
    Error: '',
    Progress: '',
    LoadedMetadata: '',
    ControlsToggle: '',
    EnterPictureInPicture: '',
    LeavePictureInPicture: '',
    SeekComplete: ''
  },
  basicEvents: {
    ...tapEvents,
    ...touchEvents
  }
};

const Canvas = {
  props: {
    type: '',
    'canvas-id': '',
    'disable-scroll': 'false'
  },
  events: {
    Error: '',
    ...touchEvents
  },
  basicEvents: {
    ...tapEvents
  }
};

const Camera = {
  props: {
    mode: addSingleQuote('normal'),
    resolution: addSingleQuote('medium'),
    'device-position': addSingleQuote('back'),
    flash: addSingleQuote('auto'),
    'frame-size': addSingleQuote('medium')
  },
  events: {
    Stop: '',
    Error: '',
    InitDone: '',
    ScanCode: ''
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
    LabelTap: '',
    ControlTap: '',
    CalloutTap: '',
    Updated: '',
    RegionChange: '',
    PoiTap: '',
    AnchorPointTap: '',
  },
  basicEvents: {
    ...tapEvents
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

const OpenData = {
  props: {
    type: '',
    'open-gid': '',
    lang: addSingleQuote('en'),
    'default-text': '',
    'default-avatar': '',
  },
  events: {
    Error: ''
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
    'background-mute': 'false',
    'min-cache': '1',
    'max-cache': '3',
    'sound-mode': addSingleQuote('speaker'),
    'auto-pause-if-navigate': 'true',
    'auto-pause-if-open-native': 'true',
    'picture-in-picture-mode': ''
  },
  events: {
    StateChange: '',
    FullScreenChange: '',
    Status: '',
    AudioVolumeNotify: '',
    LeavePictureInPicture: ''
  }

};

const LivePusher = {
  props: {
    url: '',
    mode: addSingleQuote('RTC'),
    autopush: 'false',
    muted: 'false',
    'enable-camera': 'true',
    'auto-focus': 'true',
    orientation: addSingleQuote('vertical'),
    beauty: '0',
    whiteness: '0',
    aspect: addSingleQuote('9:16'),
    'min-bitrate': '200',
    'max-bitrate': '1000',
    'audio-quality': addSingleQuote('high'),
    'waiting-image': '',
    'waiting-image-hash': '',
    zoom: 'false',
    'device-position': addSingleQuote('front'),
    'background-mute': 'false',
    mirror: 'false',
    'remote-mirror': 'false',
    'local-mirror': addSingleQuote('auto'),
    'audio-reverb-type': '0',
    'enable-mic': 'true',
    'enable-agc': 'false',
    'enablb-ans': 'false',
    'audio-volume-type': addSingleQuote('auto'),
    'video-width': '360',
    'video-height': '640',
    'beauty-style': addSingleQuote('smooth'),
    filter: addSingleQuote('standard'),
  },
  events: {
    StateChange: '',
    Status: '',
    Error: '',
    BgmStart: '',
    BgmProgress: '',
    BgmComplete: '',
    AudioVolumeNotify: '',
  }
};

const OfficialAccount = {
  props: {},
  events: {
    Load: '',
    Error: ''
  }
};

exports.internalComponents = {
  View,
  CatchView,
  StaticView,
  PureView,
  NoTouchView,
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
  Editor,
  Slider,
  PickerView,
  PickerViewColumn,
  Picker,
  Navigator,
  Image,
  StaticImage,
  Video,
  Canvas,
  Camera,
  Map: MiniappMap,
  WebView,
  OpenData,
  LivePlayer,
  LivePusher,
  OfficialAccount,
  HElement,
  CatchHElement,
  PureHElement,
  NoTouchHElement,
  HComment
};

exports.derivedComponents = new Map([
  ['CatchView', 'View'],
  ['StaticView', 'View'],
  ['PureView', 'View'],
  ['NoTouchView', 'View'],
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
  'Editor',
  'Slider',
  'Switch',
  'LivePusher',
  'HComment',
  'OpenData',
  'Image',
  'Video',
  'Canvas',
  'WebView',
  'LivePlayer',
  'LivePusher',
  'OfficialAccount'
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
  Swiper: (children, level) => `
    <swiper-item ks:for="{{r.children}}" ks:if="{{item.nodeType !== 'h-comment'}}" ks:key="nodeId">
      <template is="RAX_TMPL_CHILDREN_0" data="{{r: item.children}}" />
    </swiper-item>`,
  MovableArea: children => `
    <movable-view ks:for="{{r.children}}" ks:key="nodeId" ks:if="{{item.nodeType !== 'h-comment'}}" direction="{{item['direction']||'none'}}" inertia="{{tool.a(item['inertia'],false)}}" out-of-bounds="{{tool.a(item['out-of-bounds'],false)}}" x="{{tool.a(item['x'],0)}}" y="{{tool.a(item['y'],0)}}" damping="{{tool.a(item['damping'],20)}}" friction="{{tool.a(item['friction'],2)}}" disabled="{{tool.a(item['disabled'],false)}}" scale="{{tool.a(item['scale'],false)}}" scale-min="{{tool.a(item['scale-min'],0.5)}}" scale-max="{{tool.a(item['scale-max'],10)}}" scale-value="{{tool.a(item['scale-value'],1)}}" animation="{{tool.a(item['animation'],true)}}" bindchange="onMovableViewChange" bindscale="onMovableViewScale" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" bindtouchcancel="onTouchCancel" bindlongtap="onLongTap" bindtap="onTap" style="{{item.style}}" class="{{item.class}}" id="{{item.id}}" data-private-node-id="{{item.nodeId}}">
      <template is="RAX_TMPL_CHILDREN_0" data="{{r: item.children}}" />
    </movable-view>`,
  ScrollView: children => `
    <block ks:for="{{r.children}}" ks:key="nodeId">
      <block ks:if="{{item.nodeId}}">
        <template is="RAX_TMPL_0_scroll-view" data="{{r: item}}" />
      </block>
      <block ks:else>
        <block>{{item.content}}</block>
      </block>
    </block>
  `,
  PickerView: children => `
    <picker-view-column ks:for="{{r.children}}" ks:key="nodeId" ks:if="{{item.nodeType !== 'h-comment'}}">
      <template is="RAX_TMPL_CHILDREN_0" data="{{r: item.children}}" />
    </picker-view-column>
  `,
  Map: children => `
    <block ks:for="{{r.children}}" ks:key="nodeId">
      <block ks:if="{{item.nodeId}}">
        <template is="RAX_TMPL_0_map" data="{{r: item}}" />
      </block>
      <block ks:else>
        <block>{{item.content}}</block>
      </block>
    </block>
  `
};

exports.adapter = {
  if: 'ks:if',
  else: 'ks:else',
  elseif: 'ks:elif',
  for: 'ks:for',
  forItem: 'ks:for-item',
  forIndex: 'ks:for-index',
  key: 'ks:key',
  xs: 'wxs',
  event: 'bind',
  catchEvent: 'catch',
  eventToLowerCase: true,
  supportSjs: true,
  formatBindedData: (value) => `${value}`
};


exports.sjs = {
  tag: 'wxs',
  extension: 'wxs',
  name: 'module',
  from: 'src',
  exportExpression: 'module.exports ='
};
