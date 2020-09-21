/* eslint quotes: off */
module.exports = {
  "extends": ["./index.js"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    /**
     * Indent is replaced by two Spaces
     * @reason Conventional convention
    */
    "indent": "off",
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],

    /**
     * use of parentheses to only where they are necessary
     * @reason If set `all` as `(window as any).xxx` will trow error
    */
    "no-extra-parens": ["error", "functions"],

    /**
     * The return value of the function must be the same as the declared type
     * @reason Typescript compilation check is enough
    */
    "@typescript-eslint/explicit-function-return-type": "off",

    /**
     * Disallow usage of the `any` type
     * @reason It is difficult to avoid not using `any` type
    */
    "@typescript-eslint/no-explicit-any": "off",

    /**
     * Disallow the use of custom TypeScript modules and namespaces
     * @reason For easy to use global lib
    */
    "@typescript-eslint/no-namespace": "warn",


    /**
     * Recommended rules
     * Basic rules follow here: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
     */
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/ban-types": "error",
    "camelcase": "off",
    "@typescript-eslint/camelcase": "error",
    "@typescript-eslint/class-name-casing": "error",
    "@typescript-eslint/explicit-member-accessibility": "error",
    // "@typescript-eslint/indent": "error",
    "@typescript-eslint/interface-name-prefix": "error",
    "@typescript-eslint/member-delimiter-style": "error",
    "@typescript-eslint/no-angle-bracket-type-assertion": "error",
    "no-array-constructor": "off",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-object-literal-type-assertion": "error",
    "@typescript-eslint/no-parameter-properties": "error",
    "@typescript-eslint/no-triple-slash-reference": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/prefer-interface": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/type-annotation-spacing": "error"
  }
};