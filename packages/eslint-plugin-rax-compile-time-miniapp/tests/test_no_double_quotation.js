'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_double_quotation');

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

ruleTester.run('no-double-quotation', rule, {
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
            return <View a="1"></View>
          }`,
      errors: [
        {
          messageId: 'noDoubleQuotation',
        },
      ],
    },
  ],
});
