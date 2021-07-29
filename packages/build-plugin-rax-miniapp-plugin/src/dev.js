const chalk = require('chalk');
const consoleClear = require('console-clear');

const { handleWebpackErr } = require('rax-compile-config');

const { constants: { MINIAPP, WECHAT_MINIPROGRAM } } = require('miniapp-builder-shared');

const getMiniAppOutput = require('./getOutputPath');
const getWebpackConfig = require('./getWebpackConfig');

module.exports = (api, options = {}) => {
  const { registerTask, context, onHook } = api;
  const { userConfig, command } = context;
  const { targets } = userConfig;
  let devCompletedArr = [];


  targets.forEach((target) => {
    const isCompileProject = userConfig[target] && userConfig[target].buildType === 'compile';
    // Get output dir
    const outputPath = getMiniAppOutput(context, { target });
    const mode = command === 'start' ? 'development' : 'production';

    const webpackConfig = getWebpackConfig({ mode, target, api, outputPath, isCompileProject });
    registerTask(target, webpackConfig);
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
