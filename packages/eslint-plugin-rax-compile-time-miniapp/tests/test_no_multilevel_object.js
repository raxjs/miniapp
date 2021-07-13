'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_multilevel_object');

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

ruleTester.run('no-multilevel-object', rule, {
  valid: [
    // 合法示例
    `list.map((item, index) => {
        return (
          item.detail.infoList.map((it, idx) => {
            return it.do;
          })
        );
      })
    `,
    `<View>
      {list.map((item, index) => {
        return (
          <View>
            {item.infoList.map((it, idx) => {
              return <Text>{it}</Text>;
            })}
          </View>
        );
      })}
    </View>`,
    `
    function App() {
      return (
        <View>
          {item.detail.infoList.map((it, idx) => {
            return <View>{it}</View>;
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
          <View>
            {list.map((item, index) => {
              return (
                <View>
                  {item.detail.infoList.map((it, idx) => {
                    return <Text>{it}</Text>;
                  })}
                </View>
              );
            })}
          </View>`,
      errors: [
        {
          messageId: 'noMultilevelObject',
        },
      ],
    },
  ],
});
