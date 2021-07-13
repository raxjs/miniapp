# eslint-plugin-rax-compile-time-miniapp

Eslint plugin for rax compiler miniapp.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-rax-compile-time-miniapp`:

```
$ npm install eslint-plugin-rax-compile-time-miniapp --save-dev
```


## Usage

Add `rax-compile-time-miniapp` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "extends": [
    "eslint-config-ali/typescript/rax",
    "plugin:rax-compile-time-miniapp/recommended"
  ],
  "plugins": [
    "rax-compile-time-miniapp"
  ]
}
```





