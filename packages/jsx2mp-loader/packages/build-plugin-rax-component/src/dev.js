const consoleClear = require('console-clear');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const path = require('path');
const { handleWebpackErr } = require('rax-compile-config');

const watchLib = require('./watchLib');
const mpDev = require('./config/miniapp/dev');

const { WEB, WEEX, MINIAPP, WECHAT_MINIPROGRAM } = require('./constants');

module.exports = (api, options = {}) => {
  const { registerTask, context, onHook } = api;
  const { rootDir, userConfig } = context;
  const { devWatchLib } = userConfig;
  const { targets = [] } = options;
  
  const asyncTask = [];
  const selfDevTargets = [];
  const customDevTargets = [];
  // set dev config
  targets.forEach(target => {
    if ([WEB, WEEX].indexOf(target) > - 1) {
      const getDev = require(`./config/${target}/getDev`);
      const config = getDev(context, options);
      selfDevTargets.push(target);
      registerTask(`component-demo-${target}`, config);
    } else if ([MINIAPP, WECHAT_MINIPROGRAM].indexOf(target) > - 1) {
      const getDev = require(`./config/miniapp/getDev`);
      const config = getDev(context, options, target);
      if (target === WECHAT_MINIPROGRAM) {
        options[target].platform = 'wechat';
      }
      if (options[target].buildType === 'runtime') {
        selfDevTargets.push(target);
        registerTask(`component-demo-${target}`, config);
      } else {
        customDevTargets.push(target);
      }
    }
  });

  customDevTargets.forEach(target => {
    if (selfDevTargets.length) {
      onHook('after.start.devServer', () => {
        mpDev(context, options[target], (args) => {
          devCompletedArr.push(args);
        });
      });
    } else {
      asyncTask.push(new Promise(resolve => {
        mpDev(context, options[target], (args) => {
          devCompletedArr.push(args);
          resolve();
        });
      }));
    }
  });

  if (asyncTask.length) {
    Promise.all(asyncTask).then(() => {
      devCompileLog();
    });
  }

  let devUrl = '';
  let devCompletedArr = [];

  function devCompileLog() {
    consoleClear(true);
    let { err, stats } = devCompletedArr[0];

    devCompletedArr.forEach((devInfo) => {
      if (devInfo.err || devInfo.stats.hasErrors()) {
        err = devInfo.err;
        stats = devInfo.stats;
      }
    });

    devCompletedArr = [];

    if (!handleWebpackErr(err, stats)) {
      return;
    }

    console.log(chalk.green('Rax development server has been started:'));
    console.log();

    if (~targets.indexOf(WEB)) {
      console.log(chalk.green('[Web] Development server at:'));
      console.log('   ', chalk.underline.white(devUrl));
      console.log();
    }

    if (~targets.indexOf(WEEX)) {
      const weexUrl = `${devUrl}/weex/index.js?wh_weex=true`;
      console.log(chalk.green('[Weex] Development server at:'));
      console.log('   ', chalk.underline.white(weexUrl));
      console.log();
      qrcode.generate(weexUrl, {small: true});
      console.log();
    }

    if (~targets.indexOf(MINIAPP)) {
      console.log(chalk.green('[Ali Miniapp] Use ali miniapp developer tools to open the following folder:'));
      console.log('   ', chalk.underline.white(path.resolve(rootDir, `demo/${MINIAPP}`)));
      console.log();
    }

    if (~targets.indexOf(WECHAT_MINIPROGRAM)) {
      console.log(chalk.green('[WeChat MiniProgram] Use wechat miniprogram developer tools to open the following folder:'));
      console.log('   ', chalk.underline.white(path.resolve(rootDir, 'demo/wechat-miniprogram')));
      console.log();
    }
  }

  if (~targets.indexOf(MINIAPP)) {
    const config = options[MINIAPP] || {};
    if (targets.length > 2) {
      onHook('after.start.devServer', () => {
        mpDev(context, config, (args) => {
          devCompletedArr.push(args);
          if (devCompletedArr.length === 2) {
            devCompileLog();
          }
        });
      });
    } else {
      mpDev(context, config, (args) => {
        devCompletedArr.push(args);
        devCompileLog();
      });
    }
  }

  if (~targets.indexOf(WECHAT_MINIPROGRAM)) {
    const config = Object.assign({
      platform: 'wechat',
    }, options[WECHAT_MINIPROGRAM]);
    if (targets.length > 2) {
      onHook('after.start.devServer', () => {
        mpDev(context, config, (args) => {
          devCompletedArr.push(args);
          if (devCompletedArr.length === 2) {
            devCompileLog();
          }
        });
      });
    } else {
      mpDev(context, config, (args) => {
        devCompletedArr.push(args);
        devCompileLog();
      });
    }
  }

  if (devWatchLib) {
    onHook('after.start.devServer', () => {
      watchLib(api, options);
    });
  }

  onHook('after.start.compile', async(args) => {
    devUrl = args.url;
    devCompletedArr.push(args);
    // run miniapp build while targets have web or weex, for log control
    if (~targets.indexOf(MINIAPP) || ~targets.indexOf(WECHAT_MINIPROGRAM)) {
      if (devCompletedArr.length === 2) {
        devCompileLog();
      }
    } else {
      devCompileLog();
    }
  });
};
