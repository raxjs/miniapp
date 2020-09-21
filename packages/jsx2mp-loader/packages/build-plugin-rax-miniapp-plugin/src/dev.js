const chalk = require('chalk');
const { resolve } = require('path');
const consoleClear = require('console-clear');

const { handleWebpackErr } = require('rax-compile-config');
const getMiniAppOutput = require('./config/getOutputPath');

const { MINIAPP, WECHAT_MINIPROGRAM } = require('./constants');

module.exports = ({ onGetWebpackConfig, registerTask, context, onHook }, options = {}) => {
  const { targets = [] } = options;
  let devCompletedArr = [];

  targets.forEach((target, index) => {
    const getBase = getConfig(target, options);
    registerTask(target, getBase(context, target, options, onGetWebpackConfig));
  });

  onHook('after.start.compile', async(args) => {
    devCompletedArr.push(args);
    devCompileLog();
  });

  function devCompileLog() {
    let err = devCompletedArr[0].err;
    let stats = devCompletedArr[0].stats;

    if (!handleWebpackErr(err, stats)) {
      return;
    }

    consoleClear(true);

    devCompletedArr.forEach((devInfo) => {
      if (devInfo.err || devInfo.stats.hasErrors()) {
        err = devInfo.err;
        stats = devInfo.stats;
      }
    });

    devCompletedArr = [];

    console.log(chalk.green('Rax development server has been started:'));
    console.log();

    if (targets.includes(MINIAPP)) {
      console.log(chalk.green('[Ali Miniapp] Use ali miniapp developer tools to open the following folder:'));
      console.log('   ', chalk.underline.white(getMiniAppOutput(context, { target: MINIAPP, demoClientFolder: true })));
      console.log();
    }

    if (targets.includes(WECHAT_MINIPROGRAM)) {
      console.log(chalk.green('[WeChat MiniProgram] Use wechat miniprogram developer tools to open the following folder:'));
      console.log('   ', chalk.underline.white(getMiniAppOutput(context, { target: WECHAT_MINIPROGRAM, demoClientFolder: true })));
      console.log();
    }
  }
};

function getConfig(target, options = {}) {
  if (options[target]) {
    options[target].mode = 'watch';
  } else {
    options[target] = { mode: 'watch' };
  }
  return require('./config/getBase');
}
