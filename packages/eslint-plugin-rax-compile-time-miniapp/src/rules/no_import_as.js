/**
 * @fileoverview no import Component as CustomComponent
 * @author hirra.hl
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const description = `no import Component as CustomComponent`;

module.exports = {
  meta: {
    docs: {
      description,
      recommended: false,
    },
    messages: {
      avoidMethod: description,
    },
  },

  create: function(context) {
    return {
      ImportSpecifier: (node) => {
        if (/tsx|jsx$/.test(context.getFilename())) {
          if (node.parent && node.parent.source && node.parent.source.value === 'rax') {
            if (node.imported && node.imported.name === 'Component') {
              if (node.local && node.local.name !== 'Component') {
                context.report({
                  node,
                  messageId: 'avoidMethod',
                });
              }
            }
          }
        }
      },
    };
  },
};
