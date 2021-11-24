const baseComponents = require('../baseComponents');

/**
 * Judge whether node is base component
 * @param {Object} node
 */
module.exports = function isBaseComponent(node) {
  // Rax base components and native base components are recognized as base components
  return baseComponents.indexOf(node.name) > -1 || node && node.isNative;
};
