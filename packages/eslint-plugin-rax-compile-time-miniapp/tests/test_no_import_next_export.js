'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

let rule = require('../src/rules/no_import_next_export');

let RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

let ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 10,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
});

ruleTester.run('no-multiple-component', rule, {
  valid: [
    // 合法示例
    `import Child from './Child';
     const App = () => {
        return <Child />;
     }
     export default App;
    `,
    `import Child from './Child';
     import Child2 from './Child2';
     const App = () => {
        return <>
          <Child />
          <Child2 />
        </>;
     }
     export default App;
    `
  ],

  invalid: [
    // 不合法示例
    {
      code: `import Child from './Child';
             export default Child;
            `,
      errors: [
        {
          messageId: 'noImportNextExport',
        },
      ],
    },
    {
      code: `import { Child } from './Child';
             export default Child;
            `,
      errors: [
        {
          messageId: 'noImportNextExport',
        },
      ],
    }
  ],
});
