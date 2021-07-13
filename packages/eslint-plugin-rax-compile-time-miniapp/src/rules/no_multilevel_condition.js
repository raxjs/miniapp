/**
 * @fileoverview no multilevel condition statement for JSX
 * @author linghan
 */
'use strict';

const { docUrl } = require('../utils');

module.exports = {
  meta: {
    docs: {
      description: 'no multilevel condition statement for JSX',
      recommended: false,
      url: docUrl('no_multilevel_condition'),
    },
    messages: {
      noMultiLevelCondition: 'no multilevel condition statement for JSX',
    },
  },

  create: function(context) {
    return {
      JSXElement: (node) => {
        // like:  element = <View></View>
        if (node.parent.left) {
          let currentNode = node;
          let parent = node.parent;
          let parentConditionCount = 0;
          while (parent) {
            if (parent.type === 'IfStatement') {
              // parent.consequent mease 'if'
              if (parent.consequent === currentNode) {
                parentConditionCount += 1;
              }
              // parent.alternate means 'else if / else'
              if (parent.alternate === currentNode) {
                let alternateParent = parent;
                let alternateCurrent = parent.parent;
                while (alternateParent) {
                  if (alternateParent.consequent === alternateCurrent) {
                    parentConditionCount += 1;
                  }
                  alternateParent = alternateParent.parent;
                }
              }
            }
            currentNode = parent;
            parent = parent.parent;
          }

          if (parentConditionCount >= 2) {
            context.report({
              node,
              messageId: 'noMultiLevelCondition',
            });
          }
        }
      },
    };
  },
};
