/**
 * @fileoverview 不推荐使用内联样式
 * @author chenrongyan
 */
"use strict";

const styleSheet = require('../utils/stylesheet');
const docUrl = require('../utils/docUrl');

const util = require('util');

const { StyleSheets } = styleSheet;
const { astHelpers } = styleSheet;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "Using inline styles in runtime miniapp is not recommended",
      recommended: false,
      url: docUrl('no-inline-styles')
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const styleSheets = new StyleSheets();

    function reportInlineStyles(inlineStyles) {
      if (inlineStyles) {
        inlineStyles.forEach((style) => {
          if (style) {
            const expression = util.inspect(style.expression);
            context.report({
              node: style.node,
              message: 'Inline style: {{ expression }}',
              data: { expression },
            });
          }
        });
      }
    }

    return {
      JSXAttribute: (node) => {
        if (astHelpers.isStyleAttribute(node)) {
          const styles = astHelpers.collectStyleObjectExpressions(node.value, context);
          styleSheets.addObjectExpressions(styles);
        }
      },

      'Program:exit': () => reportInlineStyles(styleSheets.getObjectExpressions()),
    }
  }
};
