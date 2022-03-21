/**
 * @fileoverview no spread operator
 * @author hirra
 */
'use strict';

const { docUrl } = require('../utils');

module.exports = {
  meta: {
    docs: {
      description: 'no spread_operator',
      url: docUrl('no_spread'),
      recommended: false,
    },
    messages: {
      noSpreadOperator: "spread operator '{{name}}' is forbidden. FYI: https://rax.js.org/docs/guide/compile-miniapp-syntax-constraints",
    },
  },

  create: function(context) {
    return {
      JSXElement: (node) => {},
      JSXOpeningElement: (node) => {
        if (node.attributes && Array.isArray(node.attributes)) {
          const hasSpreadAttribute = node.attributes.some((attribute) => {
            return attribute.type === 'JSXSpreadAttribute';
          });
          if (hasSpreadAttribute) {
            context.report({
              node,
              messageId: 'noSpreadOperator',
              data: {
                name: node.name,
              },
            });
          }
        }
      }
    };
  },
};
