# no-id-in-jsx
如果在自定义组件上写 `id` 会造成在组件中无法通过 `props.id` 获取。

例如：`<Child id={someId} />` ，此时在 Child 中是无法通过 props.id 获取到值的。因此，Rax 在编译时做了转化，当开发者 `<Child id={someId} />` 这样写的时候，不仅会保留外层的 id，还会添加一个等值的 componentId，开发者在自定义组件中可以通过 props.componentId 获取到想要的值。

此条规则目前只是 `warning` 

## More
https://rax.alibaba-inc.com/docs/guide/compile-miniapp-syntax-constraints#%E5%85%B3%E9%94%AE%E8%AF%8D