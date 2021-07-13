'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/handler_start_with_on');

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

ruleTester.run('export-default-component', rule, {
  valid: [
    // 合法示例
    `function App(){
      return <View a='1'></View>
    }`,
  ],

  invalid: [
    // 不合法示例
    {
      code: `
          function App(){
            return <View a={()=>{}}></View>
          }`,
      errors: [
        {
          messageId: 'recommendHandlerName',
        },
      ],
    },
    {
      code: `
          function Component(props){
            props.test();
            return <View></View>
          }`,
      errors: [
        {
          messageId: 'recommendHandlerName',
        },
      ],
    },
  ],
});
