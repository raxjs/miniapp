const { resolve } = require('path');
const { readFileSync } = require('fs-extra');
const {
  pathHelper: { getHighestPriorityPackageJSON },
  platformMap
} = require('miniapp-builder-shared');

const addFileToCompilation = require('../utils/addFileToCompilation');

module.exports = function(compilation, { target, command, rootDir }) {
  const miniappRenderPackageJsonFile = getHighestPriorityPackageJSON('miniapp-render', rootDir);
  const sourceMiniappRenderFile = resolve(
    miniappRenderPackageJsonFile,
    '..',
    'dist',
    platformMap[target].type,
    command === 'build' ? 'index.min.js' : 'index.js'
  );
  addFileToCompilation(compilation, {
    filename: 'render.js',
    content: readFileSync(sourceMiniappRenderFile, 'utf-8'),
    command,
    target,
  });
};
