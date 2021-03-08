const generate = require('@babel/generator').default;

/**
 * @param expression {Expression}
 * @param overridesOption {Object}
 * @return {String}
 */
function generateExpression(expression, overridesOption = {}) {
  const { code } = generate(
    expression,
    Object.assign({
      jsescOption: {
        minimal: true // To avoid Chinese characters escaped
      }
    }, overridesOption)
  );
  return code;
}

module.exports = generateExpression;
