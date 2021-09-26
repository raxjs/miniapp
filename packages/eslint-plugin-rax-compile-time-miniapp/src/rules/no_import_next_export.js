/**
 * @fileoverview no import next export
 * @author linghan
 */
'use strict';

const { docUrl } = require('../utils');

module.exports = {
  meta: {
    docs: {
      description: 'no import next export in jsx',
      recommended: false,
      url: docUrl('no_import_next_export'),
    },
    messages: {
      noImportNextExport: 'no import next export in jsx',
    },
  },

  create: function(context) {
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
            messageId: 'noImportNextExport',
            data: {
              name: exportDeclarationName,
            },
          });
        }
      }
    };
  },
};
