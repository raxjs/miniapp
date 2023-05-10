const { join, relative, sep } = require('path');

function getRootNodeModulePath(root, current) {
  const relativePathArray = relative(root, current).split(sep) || [];

  if (relativePathArray.find((item) => item === '..')) {
    /**
     * Package hoist case exist while `..` is presented in relative path array, hence we dig into the deepest node_modules folder, and use it as root node module path
     */
    const resourcePathArray = current.split('node_modules') || [];
    return join(
      resourcePathArray
        .slice(0, resourcePathArray.length - 1)
        .join('node_modules'),
      'node_modules'
    );
  } else {
    return join(root, 'node_modules');
  }
}

module.exports = getRootNodeModulePath;
