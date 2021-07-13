# export-default-component

为了方便编译器找到导出的组件，我们对导出组件做了如下限制：
默认导出的必须是组件，即

```js

export default MyComponent;

```

当导出的组件需要被某个函数处理的时候，函数的第一个参数必须是组件，即

```js
export default handleComponent(MyComponent);
```

## More
https://rax.js.org/docs/guide/compile-miniapp-syntax-constraints#%E7%BB%84%E4%BB%B6%E5%AF%BC%E5%87%BA%E6%96%B9%E5%BC%8F