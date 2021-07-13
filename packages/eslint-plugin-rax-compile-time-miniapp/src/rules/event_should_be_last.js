/**
 * @fileoverview If handler has `event` , it should be the last param , like `(count, event) => {}`
 * @author hirra
 */
'use strict';

const { docUrl } = require('../utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const eventList = [
  'onClick',
  'catchClick',
  'onLongPress',
  'onTouchStart',
  'onTouchEnd',
  'onTouchMove',
  'onTouchCancel',
];
module.exports = {
  meta: {
    docs: {
      url: docUrl('event_should_be_last'),
      description: 'If handler has `event` , it should be the last param , like `(count, event) => {}`',
      recommended: false,
    },
  },

  create: function(context) {
    const isLoop = (node) => {
      if (node.parent) {
        if (
          node.parent.callee &&
          node.parent.callee.property &&
          (node.parent.callee.property.name === 'map' || node.parent.callee.property.name === 'forEach')
        ) {
          return true;
        } else {
          return isLoop(node.parent);
        }
      } else {
        return null;
      }
    };
    return {
      ArrowFunctionExpression: (node) => {
        if (node.parent.type === 'JSXExpressionContainer') {
          if (
            node.parent &&
            node.parent.parent &&
            node.parent.parent.name &&
            eventList.includes(node.parent.parent.name.name)
          ) {
            if (isLoop(node.parent) && node.params && node.params.length > 0) {
              const eventKey = node.params[0].name;
              if (node.body.arguments) {
                const lastParam = node.body.arguments[node.body.arguments.length - 1];
                const lastParamKey = lastParam.name || lastParam.value;
                if (eventKey !== lastParamKey) {
                  context.report({
                    node,
                    message: `${eventKey} should be the last param , like '(count, event) => {}'`,
                  });
                }
              }
            }
          }
        }
      },
    };
  },
};
