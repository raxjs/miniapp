const generate = require('@babel/generator').default;

const generateOptions = {
  sourceFileName: '',
  sourceMaps: true
};

/**
 * Generate code and map from babel ast.
 * @param ast
 */
function genCode(ast, options = {}) {
  options.sourceMaps = !options.turnOffSourceMap;
  return generate(ast, Object.assign({
    jsescOption: {
      minimal: true // To avoid Chinese characters escaped
    }
  }, generateOptions, options));
}

module.exports = genCode;
