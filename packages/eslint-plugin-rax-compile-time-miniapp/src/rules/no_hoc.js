/**
 * @fileoverview no hoc
 * @author hirra
 */
'use strict';

const { docUrl } = require('../utils');

module.exports = {
  meta: {
    docs: {
      description: 'no hoc',
      recommended: false,
      url: docUrl('no_hoc'),
    },
    messages: {
      noHoc: 'hoc "{{name}}" is forbidden.',
    },
  },

  create: function(context) {
    return {
      FunctionDeclaration: (node) => {
        if (!node.params) {
          return;
        }

        if (node.body && node.body.type === 'BlockStatement') {
          let body = [];
          const functionsList = [];
          if (Array.isArray(node.body.body)) {
            body = node.body.body;
          } else {
            body = [node.body.body];
          }
          node.body.body.forEach((state) => {
            if (state.type === 'FunctionDeclaration') {
              let subBodyList = [];
              if (Array.isArray(state.body)) {
                subBodyList = state.body;
              } else {
                subBodyList = [state.body];
              }
              functionsList.push(state.id.name);
              subBodyList.forEach((subBody) => {
                subBody.body.forEach((sb) => {
                  if (sb.type === 'ReturnStatement') {
                    if (sb.argument && sb.argument.openingElement && sb.argument.openingElement.name) {
                      context.report({
                        node,
                        messageId: 'noHoc',
                        data: {
                          name: node.id.name,
                        },
                      });
                    }
                  }
                });
              });
            }
          });
        }
      }
    };
  },
};
