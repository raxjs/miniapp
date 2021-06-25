/**
 * @fileoverview export default
 * @author hirra
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'export default only supports component',
      recommended: false,
    },
    messages: {
      avoidMethod: 'export default should be component.',
    },
  },

  create: function(context) {
    const identifierList = [];
    const returnList = [];
    return {
      FunctionDeclaration: (node) => {
        if (!node.parent.parent) {
          node.body.body.forEach((child) => {
            if (child.type === 'ReturnStatement' && child.argument.type !== 'JSXElement') {
              identifierList.push(node.id.name);
            }
          });
        }
      },
      ExportDefaultDeclaration: (node) => {
        if (node.declaration.type === 'Identifier') {
          if (identifierList.includes(node.declaration.name)) {
            if (/tsx|jsx$/.test(context.getFilename())) {
              context.report({
                node,
                messageId: 'avoidMethod',
              });
            }
          }
        }
      },
    };
  },
};
