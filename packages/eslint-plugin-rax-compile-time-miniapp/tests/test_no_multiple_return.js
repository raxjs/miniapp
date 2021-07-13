'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_multiple_return');

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

ruleTester.run('no-multiple-return', rule, {
  valid: [
    // 合法示例
    `function App(){
      return <View></View>
    }`,
  ],

  invalid: [
    // 不合法示例
    {
      code: `
          function App(){
            if(a){
              return (<View></View>)
            }
            return (<View></View>)
          }`,
      errors: [
        {
          messageId: 'noMultipleReturn',
        },
      ],
    },
    {
      code: `function App(){
            if(a){
              return (<View></View>);
              if(b){
                return (<View></View>);
              }
            }
            return (<View></View>)
          }`,
      errors: [
        {
          messageId: 'noMultipleReturn',
        },
      ],
    },
  ],
});
