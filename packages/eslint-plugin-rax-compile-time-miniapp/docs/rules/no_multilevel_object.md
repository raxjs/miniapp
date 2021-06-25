# no-multilevel-object
在第二层循环的时候不能去循环子项更深层的属性

## Rule Details

Examples of **incorrect** code for this rule:

```js

<View>
  {list.map((item, index) => {
    return (
      <View>
        {item.detail.infoList.map((it, idx) => {
          return <Text>{it}</Text>;
        })}
      </View>
    );
  })}
</View>

```

`item.detail.infoList` 的用法是错误的，如果一定要这么做，请您预先处理好数组的格式。

Examples of **correct** code for this rule:

```js

<View>
  {list.map((item, index) => {
    return (
      <View>
        {item.infoList.map((it, idx) => {
          return <Text>{it}</Text>;
        })}
      </View>
    );
  })}
</View>

```

## More
https://rax.alibaba-inc.com/docs/guide/compile-miniapp-syntax-constraints#%E5%88%97%E8%A1%A8%E6%B8%B2%E6%9F%93