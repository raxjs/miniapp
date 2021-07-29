'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_id_in_jsx');

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
      return <View xxx='1'></View>
    }`,
  ],

  invalid: [
    // 不合法示例
    {
      code: `
          function App(){
            return <View id="xxx"></View>
          }`,
      errors: [
        {
          messageId: 'noIdInJsx',
        },
      ],
    },
    {
      code: `
          function Component(props){
            const id = props.id;
            return <View></View>
          }`,
      errors: [
        {
          messageId: 'noIdInJsx',
        },
      ],
    },
  ],
});
