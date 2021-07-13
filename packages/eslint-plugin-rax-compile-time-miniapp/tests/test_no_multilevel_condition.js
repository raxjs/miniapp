'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_multilevel_condition');

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

ruleTester.run('no_multilevel_condition', rule, {
  valid: [
    // // 合法示例
    `function Element(props) {
      let element = <View></View>
      if( a > 1){
        element = <View>1</View>
      }else if(a < -1){
        element = <View>-1</View>
      }else{
        element = <View>0</View>
      }
    }`,
    `function util(option) {
      let a = 1;
      if( a > 1){
        a = 1
      }else if(a < -1){
        a = 2
      }else{
        a = 3
      }
    }`,
  ],

  invalid: [
    // 不合法示例
    {
      code: `
          function Element(props) {
            let element;
            if (props.z > 20) {
              if (props.x > 1) {
                element = <View>Hi</View>;
              }
            }
            return <>{element}</>
          }`,
      errors: [
        {
          messageId: 'noMultiLevelCondition',
        },
      ],
    },
    {
      code: `
          function Element(props) {
            let element;
            if (props.z > 20) {
              if (props.x > 1) {

              }else{
                element = <View>Hi</View>;
              }
            }
            return <>{element}</>
          }`,
      errors: [
        {
          messageId: 'noMultiLevelCondition',
        },
      ],
    }
  ],
});
