/**
 * @fileoverview no double quotation
 * @author hirra
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'no double quotation mask in jsx',
      category: 'Fill me in',
      recommended: false,
    },
    messages: {
      avoidMethod: 'no double quotation mask in jsx.',
    },
  },

  create: function(context) {
    return {
      JSXAttribute: (node) => {
        if (node.value && node.value.type === 'Literal') {
          if(/^\"/.test(node.value.raw)){
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
