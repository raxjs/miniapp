/**
 * @fileoverview no return arrays
 * @author hirra
 */
'use strict';

const { docUrl } = require('../utils');

module.exports = {
  meta: {
    docs: {
      description: 'no return arrays',
      url: docUrl('no_return_arrays'),
      recommended: false,
    },
    messages: {
      noReturnArrays: 'return jsx array is forbidden.',
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
              messageId: 'noReturnArrays',
            });
          }
        }
      },
    };
  },
};
