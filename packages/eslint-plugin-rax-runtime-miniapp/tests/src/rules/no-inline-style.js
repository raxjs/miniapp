/**
 * @fileoverview 不推荐使用内联样式
 * @author chenrongyan
 */
"use strict";

const rule = require("../../../src/rules/no-inline-styles"),
  RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 10,
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run("no-inline-style", rule, {
  valid: [
    `function Hello() {
      return (
        <Text className={styles.hello}>Hello</Text>
      );
    }`,
    `function Hello(props) {
      return (
        <Text style={{ height: props.height }}>Hello</Text>
      );
    }`
  ],

  invalid: [
    {
      code: `
        function Hello() {
          return (
            <Text style={{ backgroundColor: '#fff' }}>Hello</Text>
          );
        }
      `,
      errors: [{
        message: 'Inline style: { backgroundColor: \'#fff\' }'
      }],
    }, {
      code: `
        function Hello(props) {
          return (
            <Text style={{ height: props.height, backgroundColor: '#fff' }}>Hello</Text>
          );
        }
      `,
      errors: [{
        message: 'Inline style: { backgroundColor: \'#fff\' }'
      }]
    }
  ],
});
