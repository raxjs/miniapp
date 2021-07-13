'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_hoc');

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

ruleTester.run('no-hoc', rule, {
  valid: [
    // 合法示例
    `function handleComponent(Com) {
      return <Com />
    }`,
  ],

  invalid: [
    // 不合法示例
    {
      code: `
          function handleComponent(Com) {
            function Wrapper() {
              return <Com />
            }
            return <Wrapper />
          }`,
      errors: [
        {
          messageId: 'noHoc',
        },
      ],
    },
    {
      code: `
          function handleComponent(Com) {
            function Wrapper() {
              return <View />
            }
            return <Wrapper />
          }`,
      errors: [
        {
          messageId: 'noHoc',
        },
      ],
    },
  ],
});
