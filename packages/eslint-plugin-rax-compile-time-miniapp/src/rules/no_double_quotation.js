/**
 * @fileoverview no double quotation
 * @author hirra
 */
'use strict';

const { docUrl } = require('../utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'no double quotation mask in jsx',
      url: docUrl('no_double_quotation'),
      recommended: false,
    },
    messages: {
      noDoubleQuotation: 'no double quotation mask in jsx.',
    },
  },

  create: function(context) {
    return {
      JSXAttribute: (node) => {
        if (node.value && node.value.type === 'Literal') {
          if (/^\"/.test(node.value.raw)) {
            context.report({
              node,
              messageId: 'noDoubleQuotation',
            });
          }
        }
      },
    };
  },
};
