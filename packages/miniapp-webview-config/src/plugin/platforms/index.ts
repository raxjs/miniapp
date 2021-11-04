import * as ali from './ali';
import * as wechat from './wechat';
import * as bytedance from './bytedance';
import * as baidu from './baidu';
import * as kuaishou from './kuaishou';

const { constants: { MINIAPP, WECHAT_MINIPROGRAM, BYTEDANCE_MICROAPP, BAIDU_SMARTPROGRAM, KUAISHOU_MINIPROGRAM }} = require('miniapp-builder-shared');

export default {
  [MINIAPP]: ali,
  [WECHAT_MINIPROGRAM]: wechat,
  [BYTEDANCE_MICROAPP]: bytedance,
  [BAIDU_SMARTPROGRAM]: baidu,
  [KUAISHOU_MINIPROGRAM]: kuaishou
};
