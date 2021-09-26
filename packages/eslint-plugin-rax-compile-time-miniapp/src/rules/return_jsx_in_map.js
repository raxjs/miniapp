/**
 * @fileoverview must return jsx element in map
 * @author poji.ty
 */
'use strict';

const jsxElement = ['JSXFragment', 'JSXElement', 'JSXText', 'JSXExpressionContainer'];
const { findAncestor, docUrl } = require('../utils');

module.exports = {
  meta: {
    docs: {
      description: 'must return jsx element in map',
      recommended: false,
      url: docUrl('return_jsx_in_map'),
    },
    messages: {
      mustReturnJsxInMap: 'must return jsx element in map.',
    },
  },

  create: function(context) {
    return {
      ReturnStatement: (node) => {
        if (!node.argument) {
          return;
        }
        const { type } = node.argument;
        // 找到第一个函数调用
        const firstCallExpressionNode = findAncestor(node, (currentNode) => currentNode.type === 'CallExpression');

        // 判断是否在 JSX 里
        const isInJSXContainer = findAncestor(node, (currentNode) => jsxElement.includes(currentNode.type));

        // 判断是否在 JSX Attribute 里
        const isInAttribute = findAncestor(node, (currentNode) => currentNode.type === 'JSXAttribute');

        // 判断是不是 map 调用
        const isMapCall =
          firstCallExpressionNode &&
          firstCallExpressionNode.callee &&
          firstCallExpressionNode.callee.property &&
          firstCallExpressionNode.callee.property.name === 'map';

        if (/tsx|jsx$/.test(context.getFilename())) {
          if (isInJSXContainer && !isInAttribute) {
            if (!jsxElement.includes(type) && isMapCall) {
              context.report({
                node,
                messageId: 'mustReturnJsxInMap',
              });
            }
          }
        }
      },
    };
  },
};
