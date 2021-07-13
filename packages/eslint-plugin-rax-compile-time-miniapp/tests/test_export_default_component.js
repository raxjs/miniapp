'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/export_default_component');

let RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

let ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 10,
    sourceType: 'module',
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
    {
      code: `function Util(){
      return 1;
    }
    export default Util;
    `,
      filename: 'test.ts',
    },
  ],

  invalid: [
    // 不合法示例
    {
      code: `
          function Component2(){
            return '';
          }
          export default Component2;`,
      errors: [
        {
          messageId: 'shouldBeComponent',
        },
      ],
      filename: 'test.tsx',
    },
  ],
});
