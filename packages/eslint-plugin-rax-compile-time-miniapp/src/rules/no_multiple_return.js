/**
 * @fileoverview multiple return
 * @todo remove this rule , support multipile return in `jsx-compiler`
 * @author hirra
 */
'use strict';

const { docUrl } = require('../utils');

module.exports = {
  meta: {
    docs: {
      description: 'multiple return',
      url: docUrl('no_multiple_return'),
      recommended: false,
    },
    messages: {
      noMultipleReturn: 'multiple return is forbidden.',
    },
  },

  create: function(context) {
    const returnList = [];
    return {
      ReturnStatement: (node) => {
        if (node.argument && node.argument.type === 'JSXElement') {
          returnList.push(node);
        }
      },
      ':function:exit': () => {
        if (returnList.length >= 2) {
          const parentMap = {};
          returnList.map((returnItem) => {
            let parent = returnItem.parent;
            if (returnItem.parent && returnItem.parent.parent && returnItem.parent.parent.type === 'IfStatement') {
              parent = returnItem.parent.parent.parent;
            }

            const parentRange = parent.range.join(',');
            if (!parentMap[parentRange]) {
              parentMap[parentRange] = 1;
            } else {
              parentMap[parentRange] += 1;
              context.report({
                node: returnList[0],
                messageId: 'noMultipleReturn',
              });
            }
          });
        }
      },
    };
  },
};
