# no-hoc
不能使用高阶组件

## Rule Details
Examples of **incorrect** code for this rule:

```jsx
function handleComponent(Com) {
  function Wrapper() {
    return <Com />
  }
  return <Wrapper />
}
```

Examples of **correct** code for this rule:
```jsx
function handleComponent() {
  return <View />
}
```

## More
https://rax.alibaba-inc.com/docs/guide/compile-miniapp-syntax-constraints#%E7%BB%84%E4%BB%B6%E5%AF%BC%E5%87%BA%E6%96%B9%E5%BC%8F