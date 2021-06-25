/**
 * @fileoverview no import next export
 * @author linghan
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'no import next export in jsx',
      recommended: false,
    },
    messages: {
      avoidMethod: 'no import next export in jsx',
    },
  },

  create: function (context) {
    // 页面导入组件名称
    const importNameArray = [];
    // 导出组件名称
    let exportDeclarationName = '';

    return {
      ImportDeclaration: (node) => {
        if (Array.isArray(node.specifiers)) {
          node.specifiers.forEach((specifier) => {
            importNameArray.push(specifier.local.name);
          });
        }
      },
      ExportDefaultDeclaration: (node) => {
        exportDeclarationName = node.declaration.name;
      },
      onCodePathEnd: (codePath, node) => {
        const result = importNameArray.some(val => {
          return val === exportDeclarationName;
        });
        if (result) {
          context.report({
            node,
            messageId: 'avoidMethod',
            data: {
              name: exportDeclarationName,
            },
          });
        }
      }
    };
  },
};
