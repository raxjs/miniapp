/**
 * @Author 阿劭 tianjie.stj@alibaba-inc.com
 * @Date 2023-04-10 18:21:49
 * @LastEditors 阿劭 tianjie.stj@alibaba-inc.com
 * @LastEditTime 2023-04-10 21:33:21
 * @Description 小程序严格模式下报错 `Function(...) is not function` 兼容
 * https://aliyuque.antfin.com/tianjie.stj/nivfgf/wi0gk43l6otk3lam?singleDoc#tnMFv
 */

module.exports = function visitor({ types: t }) {

  /**
   * 判断节点是否是 Function("r", "regeneratorRuntime = r")(runtime);
   * @param {*} node 
   */
  function isFunctionRegeneratorRuntime (node) {
    return (
      t.isCallExpression(node.callee) &&
      node.callee.callee.name === 'Function' &&
      node.callee.arguments.length === 2 &&
      t.isStringLiteral(node.callee.arguments[0]) &&
      node.callee.arguments[0].value === 'r' &&
      t.isStringLiteral(node.callee.arguments[1]) &&
      node.callee.arguments[1].value === 'regeneratorRuntime = r' &&
      node.arguments.length === 1 &&
      t.isIdentifier(node.arguments[0]) &&
      node.arguments[0].name === 'runtime'
    );
  }

  return {
    visitor: {
      CallExpression(path, state) {
        const { node } = path;
        if (
          t.isCallExpression(node.callee) &&
          node.callee.callee.name === 'Function'
        ) {
          if (isFunctionRegeneratorRuntime(node)) {
            if (path.parentPath.node && t.isExpressionStatement(path.parentPath.node)) {
              path.parentPath.remove();
            }
          }
        }
      },
    }
  };
};
