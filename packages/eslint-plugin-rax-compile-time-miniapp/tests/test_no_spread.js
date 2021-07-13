'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_spread_operator');

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

ruleTester.run('no-spread-operator', rule, {
  valid: [
    // 合法示例
    '<View a={{a:1}}></View>',
    '<View a={{...props}}></View>',
  ],

  invalid: [
    // 不合法示例
    {
      code: '<View {...props}></View>',
      errors: [
        {
          messageId: 'noSpreadOperator',
        },
      ],
    },
  ],
});
