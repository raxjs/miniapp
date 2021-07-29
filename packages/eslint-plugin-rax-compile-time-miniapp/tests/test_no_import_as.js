'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_import_as');

let RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

let ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 10,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('import-as', rule, {
  valid: [
    // 合法示例
    {
      code: 'import { Component } from \'rax\'',
      filename: 'test.jsx',
    },
  ],

  invalid: [
    // 不合法示例
    {
      code: 'import { Component as RaxComponent } from \'rax\'',
      errors: [
        {
          messageId: 'noImportAs',
        },
      ],
      filename: 'test.jsx'
    },
  ],
});
