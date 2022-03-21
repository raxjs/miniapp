const { resolve, dirname, join } = require('path');
const { readJSONSync } = require('fs-extra');
const addFileToCompilation = require('../utils/addFileToCompilation');

module.exports = function(compilation, { target, declaredDep, source = '' }) {
  const pkgPath = resolve(process.cwd(), 'package.json');
  const dependencies = declaredDep || readJSONSync(pkgPath, {
    encoding: 'utf-8'
  }).dependencies;
  addFileToCompilation(compilation, {
    filename: join(dirname(source), 'package.json'),
    content: JSON.stringify({
      dependencies
    }),
    target,
  });
};
