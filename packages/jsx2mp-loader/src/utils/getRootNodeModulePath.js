const { join, relative, sep } = require('path');

function getRootNodeModulePath(root, current) {
  const relativePathArray = relative(root, current).split(sep) || [];

  if (relativePathArray.find((item) => item === '..')) {
    /**
     * Package hoist case exist while `..` is presented in relative path array
     */
    const resourcePathArray = current.split('node_modules') || [];

    if (resourcePathArray.length === 1) {
      /**
       * current file is not in node_modules folder means hard link case, so we need to use the root node_modules folder
       */
      return join(root, 'node_modules');
    } else {
      /**
       * If relative path array length is greater than 1, it means that the current file is in a nested node_modules folder, so we need to dig into the deepest node_modules folder
       */
      return join(
        resourcePathArray
          .slice(0, resourcePathArray.length - 1)
          .join('node_modules'),
        'node_modules'
      );
    }
  } else {
    return join(root, 'node_modules');
  }
}

module.exports = getRootNodeModulePath;
