const execa = require('execa');
const { join } = require('path');
const checkAliInternal = require('./utils/checkAliInternal');

let isAliInternal;
let npmRegistry;

function executeInstall(cwd) {
  return execa('npm', ['install', '--production', `--registry=${npmRegistry}`], { cwd });
}

function warnInstallManually() {
  console.log('\nInstall dependencies failed, please enter dist path and retry installing by yourself\n');
}

async function autoInstallNpm(callback, { distDir, packageJsonFilePath = []}) {
  if (isAliInternal === undefined) {
    isAliInternal = await checkAliInternal();
    npmRegistry = isAliInternal
      ? 'https://registry.npm.alibaba-inc.com'
      : 'https://registry.npm.taobao.org';
  }
  const installPromiseArray = packageJsonFilePath.map(installPath => {
    return executeInstall(join(distDir, installPath));
  });
  Promise.all(installPromiseArray)
    .then((results) => {
      if (results.some(result => result.exitCode)) {
        warnInstallManually();
      }
      callback();
    })
    .catch(() => {
      warnInstallManually();
      callback();
    });
}

module.exports = autoInstallNpm;
