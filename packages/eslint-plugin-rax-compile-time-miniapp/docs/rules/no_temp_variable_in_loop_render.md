# no-temp-variable-in-loop-render
在使用匿名函数的时候，不要在函数体内直接使用循环中产生的临时变量，如 `index` 等。

## Rule Details

Examples of **incorrect** code for this rule:

```jsx

<View>
  {
    list.map((item, index) => {
      return <View onClick={
        () => {
          console.log(index);
        }
      }>Click!</View>
    });
  }
</View>

```

Examples of **correct** code for this rule:

```jsx

<View>
  {
    list.map((item, index) => {
      return <View onClick={() => handleClick(index)}>Click!</View>
    });
  }
</View>

```

## More
https://rax.js.org/docs/guide/compile-miniapp-syntax-constraints#%E5%9C%A8%E5%BE%AA%E7%8E%AF%E4%B8%AD%E5%90%91%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F%E4%BC%A0%E9%80%92%E5%8F%82%E6%95%B0
