const { resolve } = require('path');
const { readJSONSync } = require('fs-extra');
const addFileToCompilation = require('../utils/addFileToCompilation');

module.exports = function(compilation, { target, command, declaredDep }) {
  const pkgPath = resolve(process.cwd(), 'package.json');
  const dependencies = declaredDep || readJSONSync(pkgPath, {
    encoding: 'utf-8'
  }).dependencies;
  addFileToCompilation(compilation, {
    filename: 'package.json',
    content: JSON.stringify({
      dependencies
    }),
    command,
    target,
  });
};
