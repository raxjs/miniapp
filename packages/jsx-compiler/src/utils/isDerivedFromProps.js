const t = require('@babel/types');

/**
 * Check whether the bindingName is the direct property of id
 * @param {Object} bindingPath
 * @param {string} bindingName
 * @param {boolean} shouldHasDefaultAssignment - whether need the bindingName with default assignment
 */
function checkDirectObjectProperty(bindingPath, bindingName, shouldHasDefaultAssignment) {
  const id = bindingPath.get('id');
  if (t.isObjectPattern(id)) {
    const properties = id.get('properties');
    for (let property of properties) {
      const isDirectObjectPropery = t.isObjectProperty(property) && t.isIdentifier(property.node.key) && property.node.key.name === bindingName;
      if (shouldHasDefaultAssignment) {
        if (isDirectObjectPropery && t.isAssignmentPattern(property.node.value)) {
          return true;
        }
      } else if (isDirectObjectPropery) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Judge whether a variable is derived from props
 * @param {object} scope
 * @param {string} bindingName
 * @param {object} options
 * @param {object} options.excludeAssignment If set true, then should not identify the variable if the variable has default assignment
 * @param isRecursion whether search varibales recursively
 */
module.exports = function isDerivedFromProps(scope, bindingName, { excludeAssignment = false, isRecursion = true }) {
  const binding = scope.getBinding(bindingName);
  if (binding && binding.path.isVariableDeclarator()) {
    if (excludeAssignment) {
      if (checkDirectObjectProperty(binding.path, bindingName, true)) {
        return false;
      }
    }
    const init = binding.path.get('init');

    if (init.isMemberExpression()) { // this.props
      const { object, property } = init.node;
      if (t.isThisExpression(object) && t.isIdentifier(property, { name: 'props' }) && checkDirectObjectProperty(binding.path, bindingName, false)) {
        return true;
      }
    }
    if (init.isIdentifier()) { // props
      if (init.node.name === 'props' && checkDirectObjectProperty(binding.path, bindingName, false)) {
        return true;
      }
      return isRecursion ? isDerivedFromProps(scope, init.node.name, excludeAssignment) : false;
    }
  }
  return false;
};
