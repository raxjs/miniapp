/**
 * @fileoverview no spread operator
 * @author hirra
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'no spread_operator',
      category: 'Fill me in',
      recommended: false,
    },
    messages: {
      avoidMethod: "spread operator '{{name}}' is forbidden. FYI: https://rax.alibaba-inc.com/docs/guide/syntax-constraints#%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6",
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
              messageId: 'avoidMethod',
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
