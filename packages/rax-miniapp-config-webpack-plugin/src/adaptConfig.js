const { constants: { MINIAPP, WECHAT_MINIPROGRAM, BYTEDANCE_MICROAPP, QUICKAPP } } = require('miniapp-builder-shared');

const configKeyMap = {
  [MINIAPP]: {
    window: {
      title: 'defaultTitle',
      pullRefresh: 'pullRefresh',
      titleBarColor: 'titleBarColor'
    },
    tabBar: {
      textColor: 'textColor',
      items: 'items'
    },
    items: {
      name: 'name',
      icon: 'icon',
      activeIcon: 'activeIcon',
      text: 'name',
    }
  },
  [WECHAT_MINIPROGRAM]: {
    window: {
      title: 'navigationBarTitleText',
      pullRefresh: 'enablePullDownRefresh',
      titleBarColor: 'navigationBarBackgroundColor'
    },
    tabBar: {
      textColor: 'color',
      items: 'list'
    },
    items: {
      name: 'text',
      icon: 'iconPath',
      activeIcon: 'selectedIconPath',
    }
  },
  [BYTEDANCE_MICROAPP]: {
    window: {
      title: 'navigationBarTitleText',
      pullRefresh: 'enablePullDownRefresh',
      titleBarColor: 'navigationBarBackgroundColor'
    },
    tabBar: {
      textColor: 'color',
      items: 'list'
    },
    items: {
      name: 'text',
      icon: 'iconPath',
      activeIcon: 'selectedIconPath',
    }
  },
  [QUICKAPP]: {
    window: {
      title: 'titleBarText',
      titleBarColor: 'titleBarTextColor'
    }
  }
};

const configValueMap = {
  [MINIAPP]: {
    window: {
      allowsBounceVertical: {
        true: 'YES',
        false: 'NO'
      },
      titlePenetrate: {
        true: 'YES',
        false: 'NO'
      },
      showTitleLoading: {
        true: 'YES',
        false: 'NO'
      },
      gestureBack: {
        true: 'YES',
        false: 'NO'
      },
      enableScrollBar: {
        true: 'YES',
        false: 'NO'
      },
    }
  }
};

module.exports = function adaptConfig(originalConfig, property, target) {
  const config = {};
  const configKeyAdapter =
    configKeyMap[target] && configKeyMap[target][property];
  const configValueAdapter =
    configValueMap[target] && configValueMap[target][property];
  Object.keys(originalConfig).forEach(configKey => {
    // configKey, like title
    let key = configKey;
    let value = originalConfig[configKey];
    if (
      configKeyAdapter &&
      configKeyAdapter[configKey] &&
      configKey !== configKeyAdapter[configKey]
    ) {
      key = configKeyAdapter[configKey];
    }
    if (configValueAdapter && configValueAdapter[configKey] && configValueAdapter[configKey][value] !== undefined) {
      value = configValueAdapter[configKey][value];
    }
    config[key] = value;
  });

  return config;
};
