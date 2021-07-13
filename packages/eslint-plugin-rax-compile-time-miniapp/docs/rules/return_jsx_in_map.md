# return-jsx-in-map
map 的返回值目前限制必须为一个 JSX Element。如不想多一层标签嵌套，可使用 Fragment 包裹 map 返回的值。

## Rule Details

Examples of **incorrect** code for this rule:

```jsx

<View>
  {list.map((item, index) => {
    return ( item > 1 ? <View>1</View> : <View>2</View>);
  })}
</View>

```

Examples of **correct** code for this rule:

```jsx

<View>
  {list.map((item, index) => {
    return <>{ item > 1 ? <View>1</View> : <View>2</View> } </>
    );
  })}
</View>

```

## More
https://rax.js.org/docs/guide/compile-miniapp-syntax-constraints#%E5%88%97%E8%A1%A8%E6%B8%B2%E6%9F%93