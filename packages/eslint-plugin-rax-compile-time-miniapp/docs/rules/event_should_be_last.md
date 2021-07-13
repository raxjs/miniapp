# event-should-be-last

由于语法的限制，如果绑定的事件中需要传递 event 对象，必须保证事件对象是最后一个参数。

## Rule Details

Examples of **incorrect** code for this rule:

```js

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

```

Examples of **correct** code for this rule:

```js

function Element() {
  const handleClick = (event) => {
    console.log('The click event is ', event);
  };
  return (<View>
    {
      list.map((item, index) => {
        return <View onClick={handleClick}>Click!</View>
      });
    }
  </View>);
}

```

or: 

```js

function Element() {
  const handleClick = (count, event) => {
    console.log('The click event is ', event);
  };
  return (<View>
    {
      list.map((item, index) => {
        return <View onClick={(event) => handleClick(123, event)}>Click!</View>
      });
    }
  </View>);
}

```

## More
https://rax.js.org/docs/guide/compile-miniapp-syntax-constraints#event%20%E5%AF%B9%E8%B1%A1%E4%BC%A0%E9%80%92