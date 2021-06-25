/**
 * @fileoverview no return arrays
 * @author hirra
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'no return arrays',
      category: 'Fill me in',
      recommended: false,
    },
    messages: {
      avoidMethod: 'return jsx array is forbidden.',
    },
  },

  create: function(context) {
    return {
      ReturnStatement: (node) => {
        if (node.argument && node.argument.type == 'ArrayExpression') {
          if (
            node.argument.elements.filter((element) => {
              return element.type === 'JSXElement';
            }).length
          ) {
            context.report({
              node,
              messageId: 'avoidMethod',
            });
          }
        }
      },
    };
  },
};
