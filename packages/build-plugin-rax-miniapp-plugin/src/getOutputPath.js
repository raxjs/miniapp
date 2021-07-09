const fs = require('fs-extra');
const path = require('path');
const { constants: { MINIAPP } } = require('miniapp-builder-shared');

module.exports = (context, { target = MINIAPP, demoClientFolder = false}) => {
  const { rootDir } = context;
  if (demoClientFolder) {
    return path.resolve(rootDir, 'demo', target);
  }
  return path.resolve(rootDir, 'demo', target, 'plugin');

};
