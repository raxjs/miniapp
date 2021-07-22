/**
 * @fileoverview no import Component as CustomComponent
 * @author hirra.hl
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const description = 'no \'import component as\' , like : import { Component as CustomComponent } from \'rax\' ';

module.exports = {
  meta: {
    docs: {
      description,
      recommended: false,
    },
    messages: {
      noImportAs: description,
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
                  messageId: 'noImportAs',
                });
              }
            }
          }
        }
      },
    };
  },
};
