'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/event_should_be_last');

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

ruleTester.run('event-should-be-last', rule, {
  valid: [
    // 合法示例
    `function Element() {
      const handleClick = (count, event) => {
        console.log('The click event is ', event);
      };
      return (
        <View>
          {list.map((it) => {
            return <View onClick={(event) => handleClick(123, event)}>{it}</View>;
          })}
        </View>
      );
    }`,
    `function Element() {
      const handleClick = (event) => {
        console.log('The click event is ', event);
      };
      return (
        <View>
          {list.map((it) => {
            return <View onClick={handleClick}>{it}</View>;
          })}
        </View>
      );
    }
    `,
    `function Element() {
      const handleClick = (event) => {
        console.log('The click event is ', event);
      };
      return (
        <View>
          <View onClick={handleClick}>{it}</View>;
        </View>
      );
    }
    `,
    `function Element() {
      return (
        <View>
          <View onCustomClick={(event) => handleClick(event, 123)}>{it}</View>;
        </View>
      );
    }
    `,
  ],

  invalid: [
    // 不合法示例
    {
      code: `
          function Element() {
            const handleClick = (event, count) => {
              console.log('The click event is ', event);
            };
            return (
              <View>
                {list.map((it) => {
                  return <View onClick={(event) => handleClick(event, 123)}>{it}</View>;
                })}
              </View>
            );
          }
`,
      errors: [
        {
          message: "event should be the last param , like '(count, event) => {}'",
        },
      ],
    },
  ],
});
