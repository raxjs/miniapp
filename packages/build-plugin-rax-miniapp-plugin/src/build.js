const chalk = require('chalk');
const consoleClear = require('console-clear');
const { handleWebpackErr } = require('rax-compile-config');
const { constants: { MINIAPP, WECHAT_MINIPROGRAM } } = require('miniapp-builder-shared');
const getWebpackConfig = require('./getWebpackConfig');

const getMiniAppOutput = require('./getOutputPath');

module.exports = (api, options = {}) => {
  const { registerTask, context, onHook } = api;
  const { userConfig, command } = context;

  const { targets } = userConfig;

  targets.forEach((target) => {
    const isCompileProject = userConfig[target] && userConfig[target].buildType === 'compile';

    // Get output dir
    const outputPath = getMiniAppOutput(context, { target });
    const mode = command === 'start' ? 'development' : 'production';

    const webpackConfig = getWebpackConfig({ mode, target, api, outputPath, isCompileProject });
    registerTask(target, webpackConfig);
  });

  onHook('after.build.compile', ({ err, stats }) => {
    consoleClear(true);
    if (!handleWebpackErr(err, stats)) {
      return;
    }
    logBuildResult(targets, context);
  });
};

/**
 * Log build result
 * @param {array} targets
 * @param {object} context
 */
function logBuildResult(targets = [], context = {}) {
  const { rootDir, userConfig = {} } = context;
  const { outputDir } = userConfig;

  console.log(chalk.green('Rax build finished:'));
  console.log();

  if (targets.includes(MINIAPP)) {
    console.log(chalk.green('[Alibaba MiniApp] Plugin Bundle at:'));
    console.log('   ', chalk.underline.white(getMiniAppOutput(context, {
      target: MINIAPP,
    })));
    console.log();
  }

  if (targets.includes(WECHAT_MINIPROGRAM)) {
    console.log(chalk.green('[WeChat MiniProgram] Plugin Bundle at:'));
    console.log('   ', chalk.underline.white(getMiniAppOutput(context, {
      target: WECHAT_MINIPROGRAM,
    })));
    console.log();
  }
}
