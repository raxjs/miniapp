'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_return_arrays');

let RuleTester = require('eslint').RuleTester;

let ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 10,
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('no-return-arrays', rule, {
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
            return [<View></View>, <View></View>]
          }`,
      errors: [
        {
          messageId: 'noReturnArrays',
        },
      ],
    },
  ],
});
