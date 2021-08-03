const { resolve, join } = require('path');
const { moveSync, removeSync, writeJSONSync, readJSONSync } = require('fs-extra');
const { fork } = require('child_process');
const { constants: { WECHAT_MINIPROGRAM } } = require('miniapp-builder-shared');

const baseDir = process.cwd();
const CLIENT_DIR = 'miniprogram';
const CLOUD_DIR = 'cloudfunctions';
let firstCompile = true;

async function packageCloudFunctions() {
  const child = fork(join(__dirname, './package_process.js'), {
    env: {
      NODE_ENV: 'production',
    },
    stdio: 'inherit'
  });

  return new Promise((resolve, reject) => {
    child.on('exit', signal => {
      if (signal === 0) {
        resolve(signal);
      } else {
        reject(signal);
      }
    });
    child.on('error', e => {
      console.log('e', e);
      reject(e);
    });
  });
}

function moveCloudFunctions(outputCloudPath) {
  removeSync(outputCloudPath);
  moveSync(resolve(baseDir, 'cloudfunctions'), outputCloudPath);
}

function handleProjectConfigFile(outputPath, outputClientPath) {
  const ordinaryProjectConfigFilePath = resolve(outputClientPath, 'project.config.json');
  const newProjectConfigFilePath = resolve(outputPath, 'project.config.json');

  const ordinaryContent = readJSONSync(ordinaryProjectConfigFilePath);
  const newContent = Object.assign(ordinaryContent, {
    miniprogramRoot: 'miniprogram/',
    cloudfunctionRoot: 'cloudfunctions/'
  });
  writeJSONSync(ordinaryProjectConfigFilePath, newContent, { spaces: 2 });
  moveSync(ordinaryProjectConfigFilePath, newProjectConfigFilePath, { overwrite: true });
}

async function handleBuildFiles(outputPath) {
  const outputClientPath = join(outputPath, CLIENT_DIR);
  const outputCloudPath = join(outputPath, CLOUD_DIR);
  const start = Date.now();
  console.log('[Midway] Build cloud functions…');
  await packageCloudFunctions();
  moveCloudFunctions(outputCloudPath);
  if (firstCompile) {
    handleProjectConfigFile(outputPath, outputClientPath);
    firstCompile = false;
  }
  console.log(`[Midway] Build finished, cost ${Date.now() - start}ms`);
}

module.exports = ({ context, onGetWebpackConfig, onHook }) => {
  const { rootDir, userConfig } = context;
  const { targets, outputDir = 'build' } = userConfig;
  if (targets.includes(WECHAT_MINIPROGRAM)) {
    const outputPath = resolve(rootDir, outputDir, WECHAT_MINIPROGRAM);
    const outputClientPath = join(outputPath, CLIENT_DIR);
    onGetWebpackConfig(WECHAT_MINIPROGRAM, (config) => {
      config.output.path(outputClientPath);
      if (config.plugins.has('MiniAppConfigPlugin')) {
        config.plugin('MiniAppConfigPlugin').tap((options) => {
          options[0].outputPath = outputClientPath;
          return options;
        });
      }
    });
    onHook('after.start.compile', async() => await handleBuildFiles(outputPath));
    onHook('after.build.compile', async() => await handleBuildFiles(outputPath));
  }
};
