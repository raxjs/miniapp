const CodeError = require('../utils/CodeError');
const getPagePath = require('../utils/getPagePath');

module.exports = function visitor({ types: t }, { nativeLifeCycleMap, isPluginProject }) {
  return {
    visitor: {
      CallExpression(path, { filename, file: { code } }) {
        const pagePath = getPagePath(filename);
        if (pagePath) {
          const nativeLifeCycle = nativeLifeCycleMap[pagePath];
          if (t.isIdentifier(path.node.callee, {
            name: 'registerNativeEventListeners'
          })) {
            if (t.isArrayExpression(path.node.arguments[1])) {
              path.node.arguments[1].elements.forEach(element => {
                nativeLifeCycle[element.value] = true;
              });
              path.remove();
              return;
            } else {
              throw new CodeError(code, path.node.loc,
                "registerNativeEventListeners's second argument should be an array, like ['onReachBottom']");
            }
          }
          /* In miniapp plugins project,
            transform addNativeEventListener -> document.addEventListener
            transform removeNativeEventListener -> document.removeEventListener
          */
          if (isPluginProject) {
            if (t.isIdentifier(path.node.callee, {
              name: 'addNativeEventListener'
            })) {
              path.get('callee').replaceWith(t.memberExpression(t.identifier('document'), t.identifier('addEventListener')))
            } else if (t.isIdentifier(path.node.callee, {
              name: 'removeNativeEventListener'
            })) {
              path.get('callee').replaceWith(t.memberExpression(t.identifier('document'), t.identifier('removeEventListener')))
            }
          }
        }
      },
      ImportDeclaration(path) {
        // In miniapp plugin project, remove rax-app because it can't be used directly
        if (isPluginProject && t.isStringLiteral(path.node.source, { value: 'rax-app' })) {
          path.remove();
        }
      }
    }
  };
};
