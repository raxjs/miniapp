'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/return_jsx_in_map');

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

ruleTester.run('return_jsx_in_map', rule, {
  valid: [
    // 合法示例
    // 1. rax 官方示例
    {
      code: `function Test() {
        return (
          <View>
            {list.map((item, index) => {
              return <>{item > 1 ? <View>1</View> : <View>2</View>} </>
            })}
          </View>
        )
      }
      `,
      filename: 'test.jsx',
    },
    // 2. forEach return，父节点包含 map
    `
      function Test() {
        return (
          <View>
            {list.map((item, index) => {
              list1.forEach(() => {
                return item > 1 ? <View>1</View> : <View>2</View>
              })
              return <div>123</div>
            })}
          </View>
        )
      }
      `,
    // forEach return
    {
      code: `
      function Test() {
        return (
          <View>
            {list.forEach((item, index) => {
              return item > 1 ? <View>1</View> : <View>2</View>
            })}
          </View>
        )
      }
      `,
      filename: 'test.jsx',
    },
    // useEffect return
    {
      code: `
      function Test() {
        useEffect(()=>{
          list.c.b.c.map(item=>{
            return null;
          })
        }, [])
        return (
          <View>
            test
          </View>
        )
      }
      `,
      filename: 'test.jsx',
    },
    // function return
    {
      code: `
      function Test() {
        const el = list.c.b.c.map(item=>{
          return null;
        })
        return (
          <View>
            test
          </View>
        )
      }
      `,
      filename: 'test.jsx',
    },
    // attribute
    {
      code: `function Test() {
        return (
          <Imageupload
            ImageList={item.componentData.fields.photos}
            maxCount={item.componentData.fields.maxCount}
            onChange={(data) => {
              const uploadData = data.map((uploadImageitem) => {
                return { url: uploadImageitem.uri };
              });
              onChange(item.uuid, { photos: uploadData });
            }}
          />
        )
      }`,
      filename: 'test.jsx'
    },
    // Tao Piao Piao
    {
      code: `
        function Test(){
          return (
          <ButtonTabs
            className={'movie-list-tabs'}
            x-if={tabListLength > 0}
            index={tabIndex}
            tabs={
              tabList &&
              tabList.map(item => {
                if (item && item.tabTitle && item.tabTitle.length > 0) {
                  return {
                    text: item.tabTitle
                  };
                }
                return {
                  text: ''
                };
              })
            }
          />)
        }`,
      filename: 'test.jsx'
    }
  ],

  invalid: [
    // 不合法示例
    {
      code: `
      function Test() {
        return (
          <View>
            {list.map((item, index) => {
              return item > 1 ? <View>1</View> : <View>2</View>
            })}
          </View>
        )
      }
      `,
      filename: 'test.tsx',

      errors: [
        {
          messageId: 'mustReturnJsxInMap',
        },
      ],
    },
  ],
});
