'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_temp_variable_in_loop_render');

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

ruleTester.run('test_no_temp_variable_in_loop_render', rule, {
  valid: [
    // 合法示例
    `
    import View from 'rax-view';
    list.map((item, index) => {
      return <View onClick={() => handleClick(index)}>
               <View onClick={() => fff}>{234}</View>
             </View>
     })`,
    `list.map((item, index) => {
      return <View onClick={handleClick}>
               <View onClick={() => fff}>{234}</View>
             </View>
     })`,
    `
     import TrackerLink from './tracker-link' ;
     export default function (){
      list.map((item, index) => {
          return <TrackerLink onClick={() => {
                    handleClick(index)
                }} />
        });
     }`,
    `
    import View from 'rax-view';
    export default function(){
      <View className="s-history-content">
        {list.map((item, key) => (
          <View
            className="s-history-item"
            key={key}
            data-item={item}
            onClick={(e) => {
              const { target: { dataset: { item = '' } = {} } = {} } = e;
              clickKeyword(item);
            }}
          >
            {item}
          </View>
        ))}
      </View>
    }`,
    `
    import View from 'rax-view';
    export default function(){
      <View className="s-history-content">
        {list.map((item, key) => (
          <View
            className="s-history-item"
            key={key}
            data-item={item}
            onClick={(e) => {
              const item = 'xxxx';
              clickKeyword(item);
            }}
          >
            {item}
          </View>
        ))}
      </View>
    }`,
  ],

  invalid: [
    // 不合法示例
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                  handleClick(index)
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                var a = index;
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                var a = 2 + index();
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                var a = 2 + index.foo;
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                var a = index();
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                var a = index.slice();
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                var a = foo(0, index);
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                var a = foo.slice(0, index);
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                a.length = index;
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                a.length = index();
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                a.length = foo(index);
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                a.length = foo.bar(index);
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                item.foo()
              }}>
                 <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                item.a = 1;
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                index += 1;
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                index++
              }}>
                <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
      import View from 'rax-view';
      list.map((item, index) => {

        return <View onClick={() => {
                a + index
              }}>
               <View onClick={() => fff}>{234}</View>
               </View>
       })`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
    {
      code: `
        import View from 'rax-view';
        export default function(){
          <View className="s-history-content">
            {list.map((item, key) => (
              <View
                className="s-history-item"
                key={key}
                data-item={item}
                onClick={(e) => {
                  const item = 'xxxx';
                  clickKeyword(key);
                }}
              >
                {item}
              </View>
            ))}
          </View>
        }`,
      errors: [
        {
          messageId: 'noTempVariableInLoopRender',
        },
      ],
    },
  ],
});
