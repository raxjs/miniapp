# no-multilevel-condition
你不能通过嵌套 if 来实现条件渲染

## Rule Details
Examples of **incorrect** code for this rule:

```js

function Element(props) {
  let element;
  if (props.z > 20) {
    if (props.x > 1) {
      element = <View>Hi</View>;
    }
  }
  return <>{element}</>
}

```

Examples of **correct** code for this rule:

```js

function Element(props) {
  let element;
  if (props.x > 1) {
    element = <View>Hi</View>;
  } else if(props.y > 2) (
    element = <View>Wow!</View>;
  ) else {
    element = <View>Hey!</View>
  }
  return <>{element}</>
}

```

## More
https://rax.alibaba-inc.com/docs/guide/compile-miniapp-syntax-constraints#%E6%99%AE%E9%80%9A%E5%87%BD%E6%95%B0%E7%BB%84%E4%BB%B6