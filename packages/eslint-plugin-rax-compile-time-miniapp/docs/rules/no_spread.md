# no-spread
不支持直接在组件上使用扩展运算符

## Rule Details

Examples of **incorrect** code for this rule:

```jsx

<View {...props}></View>

```

Examples of **correct** code for this rule:

```jsx

<View xxx = {...object}></View>

```

## More
https://rax.alibaba-inc.com/docs/guide/compile-miniapp-syntax-constraints#%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6