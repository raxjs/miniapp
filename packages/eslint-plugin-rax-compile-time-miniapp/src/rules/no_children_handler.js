/**
 * @fileoverview shouldn't handle `props.children`
 * @author hirra
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const { findAncestor } = require('../utils');

const jsxElement = ['JSXFragment', 'JSXElement', 'JSXText', 'JSXExpressionContainer'];

module.exports = {
  meta: {
    docs: {
      description: 'shouldn\'t handle \'props.children\'',
      recommended: false,
    },
    messages: {
      noChildrenHandler: 'shouldn\'t handle \'props.children\'',
    },
  },

  create: function(context) {
    let definedPropsChildren = false; // const {children} = props;
    return {
      MemberExpression: (node) => {
        if (!/tsx|jsx$/.test(context.getFilename())) {
          return;
        }
        if (node.parent && node.parent.type === 'MemberExpression') {
          if (node.object && node.object.name === 'props') {
            if (node.property && node.property.name === 'children') {
              if (node.parent.property) {
                context.report({
                  node,
                  messageId: 'noChildrenHandler',
                });
              }
            }
          }
        }
      },

      'MemberExpression:exit': (node) => {
        // handle ` { children.map(item => {}) }`
        if (node.object && node.object.name === 'children' && node.property) {
          if (definedPropsChildren) {
            if (
              findAncestor(node, (parent) => {
                return jsxElement.includes(parent.type);
              })
            ) {
              context.report({
                node,
                messageId: 'noChildrenHandler',
              });
            }
          }
        }
      },

      // handle `const { children } = props;`
      ObjectPattern: (node) => {
        if (!/tsx|jsx$/.test(context.getFilename())) {
          return;
        }
        if (Array.isArray(node.properties)) {
          const { properties } = node;
          if (node.parent && node.parent.init && node.parent.init.name === 'props') {
            properties.map((p) => {
              if (p.value && p.value.name === 'children') {
                definedPropsChildren = true;
              }
            });
          }
        }
      },
    };
  },
};
