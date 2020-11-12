const traverse = require('./traverseNodePath');

module.exports = function getDefaultComponentFunctionPath(path) {
  let defaultComponentFunctionPath = null;
  traverse(path, {
    ExportDefaultDeclaration(exportDefaultPath) {
      const declarationPath = exportDefaultPath.get('declaration');
      if (declarationPath.isFunctionDeclaration()) {
        defaultComponentFunctionPath = declarationPath;
      }
    }
  });

  return defaultComponentFunctionPath;
};
