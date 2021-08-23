'use strict';

/**
 * StyleSheets represents the StyleSheets found in the source code.
 * @constructor
 */
function StyleSheets() {
  this.styleSheets = {};
}

/**
 * AddObjectexpressions adds an array of expressions to the ObjectExpressions collection
 * @param {Array} expressions - an array of expressions containing ObjectExpressions in
 * inline styles
 */
StyleSheets.prototype.addObjectExpressions = function (expressions) {
  if (!this.objectExpressions) {
    this.objectExpressions = [];
  }
  this.objectExpressions = this.objectExpressions.concat(expressions);
};

/**
 * GetObjectExpressions returns an array of collected object expressiosn used in inline styles
 * @returns {Array}
 */
StyleSheets.prototype.getObjectExpressions = function () {
  return this.objectExpressions;
};

let currentContent;
const getSourceCode = (node) => currentContent
  .getSourceCode(node)
  .getText(node);

const astHelpers = {
  isStyleAttribute: function (node) {
    return Boolean(
      node.type === 'JSXAttribute'
      && node.name
      && node.name.name
      && node.name.name.toLowerCase().includes('style')
    );
  },
  
  hasArrayOfStyleReferences: function (node) {
    return node && Boolean(
      node.type === 'JSXExpressionContainer'
      && node.expression
      && node.expression.type === 'ArrayExpression'
    );
  },

  collectStyleObjectExpressions: function (node, context) {
    currentContent = context;
    if (astHelpers.hasArrayOfStyleReferences(node)) {
      const styleReferenceContainers = node
        .expression
        .elements;

      return astHelpers.collectStyleObjectExpressionFromContainers(
        styleReferenceContainers
      );
    } if (node && node.expression) {
      return astHelpers.getStyleObjectExpressionFromNode(node.expression);
    }

    return [];
  },

  collectStyleObjectExpressionFromContainers: function (nodes) {
    let objectExpressions = [];
    nodes.forEach((node) => {
      objectExpressions = objectExpressions
        .concat(astHelpers.getStyleObjectExpressionFromNode(node));
    });

    return objectExpressions;
  },

  getStyleObjectFromExpression: function (node) {
    const obj = {};
    let invalid = false;
    if (node.properties && node.properties.length) {
      node.properties.forEach((p) => {
        if (!p.value || !p.key) {
          return;
        }
        if (p.value.type === 'Literal') {
          invalid = true;
          obj[p.key.name] = p.value.value;
        } else if (p.value.type === 'ConditionalExpression') {
          const innerNode = p.value;
          if (innerNode.consequent.type === 'Literal' || innerNode.alternate.type === 'Literal') {
            invalid = true;
            obj[p.key.name] = getSourceCode(innerNode);
          }
        } else if (p.value.type === 'UnaryExpression' && p.value.operator === '-' && p.value.argument.type === 'Literal') {
          invalid = true;
          obj[p.key.name] = -1 * p.value.argument.value;
        } else if (p.value.type === 'UnaryExpression' && p.value.operator === '+' && p.value.argument.type === 'Literal') {
          invalid = true;
          obj[p.key.name] = p.value.argument.value;
        }
      });
    }
    return invalid ? { expression: obj, node: node } : undefined;
  },

  getStyleObjectExpressionFromNode: function (node) {
    let leftStyleObjectExpression;
    let rightStyleObjectExpression;

    if (!node) {
      return [];
    }

    if (node.type === 'ObjectExpression') {
      return [astHelpers.getStyleObjectFromExpression(node)];
    }

    switch (node.type) {
      case 'LogicalExpression':
        leftStyleObjectExpression = astHelpers.getStyleObjectExpressionFromNode(node.left);
        rightStyleObjectExpression = astHelpers.getStyleObjectExpressionFromNode(node.right);
        return [].concat(leftStyleObjectExpression).concat(rightStyleObjectExpression);
      case 'ConditionalExpression':
        leftStyleObjectExpression = astHelpers.getStyleObjectExpressionFromNode(node.consequent);
        rightStyleObjectExpression = astHelpers.getStyleObjectExpressionFromNode(node.alternate);
        return [].concat(leftStyleObjectExpression).concat(rightStyleObjectExpression);
      default:
        return [];
    }
  },
}

module.exports.astHelpers = astHelpers;
module.exports.StyleSheets = StyleSheets;