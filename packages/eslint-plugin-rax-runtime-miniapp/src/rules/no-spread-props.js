/**
 * @fileoverview 不推荐使用 {..props} 的方式传参
 * @author chenrongyan
 */
"use strict";

const util = require('util');
const docUrl = require('../utils/docUrl');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "{...props} in runtime miniapp is not recommended",
      recommended: false,
      url: docUrl('no-spread-props'),
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    const objectExpressions = [];
    function reportSpreadProps(spreadProps) {
      if (spreadProps) {
        spreadProps.forEach(prop => {
          console.log(prop);
          if (prop) {
            const expression = util.inspect(prop.expression);
            context.report({
              node: prop.node,
              message: 'Spread style: {{ expression }}',
              data: { expression }
            })
          }
        })
      }
    }

    return {
      JSXSpreadAttribute: (node) => {
        objectExpressions.push(node);
      },
      
      'Program:exit': () => reportSpreadProps(objectExpressions)
    };
  },
};
