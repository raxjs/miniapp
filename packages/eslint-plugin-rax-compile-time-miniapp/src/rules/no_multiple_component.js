/**
 * @fileoverview no mulitpile component
 * @author hirra
 */
'use strict';

const { docUrl } = require('../utils');

module.exports = {
  meta: {
    docs: {
      description: 'no multipile component',
      recommended: false,
      url: docUrl('no_multiple_component'),
    },
    messages: {
      noMultipleComponent: 'no multipile component in one file.',
    },
  },

  create: function(context) {
    let count = 0;
    const isComponent = (node) => {
      if (node.type === 'FunctionDeclaration') {
        if (node.body && Array.isArray(node.body.body)) {
          return node.body.body.some((bd) => {
            if (bd.type === 'ReturnStatement') {
              if (bd.argument.type === 'JSXElement') {
                return true;
              }
            }
          });
        }
      }
    };
    return {
      FunctionDeclaration: (node) => {
        if (isComponent(node)) {
          count++;
          if (count >= 2) {
            context.report({
              node,
              messageId: 'noMultipleComponent',
            });
          }
        }
      },
    };
  },
};
