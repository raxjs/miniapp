const { resolve } = require('path');
const { readFileSync } = require('fs-extra');
const adapter = require('../adapter');
const addFileToCompilation = require('../utils/addFileToCompilation');
const {
  pathHelper: { getHighestPriorityPackageJSON },
} = require('miniapp-builder-shared');

module.exports = function(compilation, { target, command, rootDir }) {
  const miniappRenderPackageJsonFile = getHighestPriorityPackageJSON('miniapp-render', rootDir);
  const sourceMiniappRenderFile = resolve(
    miniappRenderPackageJsonFile,
    '..',
    'dist',
    adapter[target].fileName,
    command === 'build' ? 'index.min.js' : 'index.js'
  );
  addFileToCompilation(compilation, {
    filename: 'render.js',
    content: readFileSync(sourceMiniappRenderFile, 'utf-8'),
    command,
    target,
  });
};
