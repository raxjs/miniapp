'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_children_handler');

let RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

let ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 10,
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('no-children-handler', rule, {
  valid: [
    // 合法示例
    {
      code: `function App(props){
      return <View> {props.children}</View>
    }`,
      filename: 'test.jsx',
    },
  ],

  invalid: [
    // 不合法示例
    {
      code: `
          function App(){
            const loop = props.children.map ;
          }`,
      errors: [
        {
          messageId: 'noChildrenHandler',
        },
      ],
      filename: 'test.jsx',
    },
    // 不合法示例
    {
      code: `
          function App(){
            const { children } = props ;
            return <View> { children.map(item => {
              
            })}</View>
          }`,
      errors: [
        {
          messageId: 'noChildrenHandler',
        },
      ],
      filename: 'test.jsx',
    },
  ],
});
