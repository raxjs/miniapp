'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_multiple_component');

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

ruleTester.run('no-multiple-component', rule, {
  valid: [
    // 合法示例
    `function App(){
      return <View xxx='1'></View>
    }`,
    `
    function foo(){
      return 1;
    }
    function App(){
      return <View xxx='1'></View>
    }`,
    `
    function App() {
      return (
        <View>
          {list.map((item, index) => {
            return (
              <View>
                {item.detail.infoList.map((it, idx) => {
                  return <View>{it}</View>;
                })}
              </View>
            );
          })}
        </View>
      );
    }
    `,
  ],

  invalid: [
    // 不合法示例
    {
      code: `
          function Test(){
            return <View></View>
          }
          function App(){
            return <View id="xxx"></View>
          }`,
      errors: [
        {
          messageId: 'noMultipleComponent',
        },
      ],
    }
  ],
});
