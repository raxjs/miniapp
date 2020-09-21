# stylesheet-loader

> A webpack loader that imports a css file and converts it to be used as an inline style

## Install

```sh
npm install --save-dev stylesheet-loader
```

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Config stylesheet loader in `webpack.config.js`:
```js
// webpack.config.js

module.export = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'stylesheet'
      }
    ]
  }
};
```

```css
/* foo.css */
.container {
  background-color: blue;
}

.container_title {
  font-size: 20px;
}
```

```js
// foo.js
import styles from './foo.css';

function Foo() {
  return <div style={styles.container}>
    <span style={styles.container_title>hello world</span>
  </div>;
}
export default Foo;
```

### tag/id selector

```css
div {
  color: red;
}

#main {
  width: 100%;
}
```

```js
{
  '@div': {
    color: 'red'
  },
  '#main': {
    width: '100%'
  }
}
```



### Write less

`webpack.config.js`:
```
{
  test: /\.less$/,
  loader: 'stylesheet!less'
}
```

```less
// foo.less
@contaner-bg: #5B83AD;
@title-size: 20px;

.container {
  background-color: @contaner-bg;
}

.container_title {
  font-size: @title-size;
}
```

```js
// foo.less
import styles from './foo.less';

function Foo() {
  return <div style={styles.container}>
    <span style={styles.container_title>hello world</span>
  </div>;
}
export default Foo;
```

### Options

#### `transformDescendantCombinator`

Default does not support nested, but you can also choose to avoid this constraint when set `transformDescendantCombinator` to true.

### Support font-face

```css
@font-face {
  font-family: icon;
  src: url(http://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf);
}
```

### Support media query

Media type support `screen` and `all`. Media features only support `width` and `height`. Look [@media](https://developer.mozilla.org/en-US/docs/Web/CSS/@media).

```css
@media screen and (min-width: 480px) {
  .title {
    font-size: 25rem;
  }
}
```

### Support pseudo class

Pseudo class only in weex. Index of support pseudo classes

* `:active`
* `:focus`
* `:disabled`
* `:enabled`

Example
```css
.container:active {
  background-color: red;
}
```

### Support gradient

You can use gradient in Weex 0.10.0+.

```css
background-image: linear-gradient(to right, blue, white);
```

### Support global css variables

You can write `var()` in css. Variables need to be defined in `:root`

```css
:root {
  --color-error-1: red;
}
.text {
  color: var(--color-error-1);
}
```

### Support light or dark color theme.

**Web:**

```css
body { background-color: #ffffff; }
@media (prefers-color-scheme: dark) {
  body { background-color: #000000; }
}
@media (prefers-color-scheme: light) {
  body { background-color: #ffffff; }
}
```
**Weex:**

Compile to -weex-dark-scheme-xxx and -weex-light-scheme-xxx

```css
body {
  background-color: #ffffff;
  -weex-dark-scheme-background-color: #000000;
  -weex-light-scheme-background-color: #ffffff;
}
```

## Validation

We followed the [css-layout](https://github.com/facebook/yoga) style standard. There will be a friendly reminder on the console when your code is not standardized.

<p align="center">
  <img alt="stylesheet validation" src="https://gw.alicdn.com/tfs/TB1EHgXPXXXXXc3XVXXXXXXXXXX-1324-208.png" width="400">
</p>
