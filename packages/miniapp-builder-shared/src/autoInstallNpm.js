const execa = require('execa');
const { checkAliInternal } = require('ice-npm-utils');

let isAliInternal;
let npmRegistry;

async function autoInstallNpm(dir, callback) {
  if (isAliInternal === undefined) {
    isAliInternal = await checkAliInternal();
    npmRegistry = isAliInternal
      ? 'https://registry.npm.alibaba-inc.com'
      : 'https://registry.npm.taobao.org';
  }
  execa('npm', ['install', '--production', `--registry=${npmRegistry}`], {
    cwd: dir,
  })
    .then(({ exitCode }) => {
      if (!exitCode) {
        callback();
      } else {
        console.log(
          `\nInstall dependencies failed, please enter ${dir} and retry by yourself\n`
        );
        callback();
      }
    })
    .catch(() => {
      console.log(
        `\nInstall dependencies failed, please enter ${dir} and retry by yourself\n`
      );
      callback();
    });
}

module.exports = autoInstallNpm;
