const { transformSync } = require('@babel/core');

const parserOpts = {
  plugins: [
    'classProperties',
    'jsx',
    'typescript',
    'trailingFunctionCommas',
    'asyncFunctions',
    'exponentiationOperator',
    'asyncGenerators',
    'objectRestSpread',
    ['decorators', { decoratorsBeforeExport: false }],
    'dynamicImport',
  ], // support all plugins
};

function removeDeadCode(source) {
  // 按需
  // if (!source?.includes('import ')) {
  //   return source;
  // }
  return transformSync(source, {
    parserOpts,
    plugins: [
      'babel-plugin-minify-dead-code-elimination-while-loop-fixed'
    ]
  }).code;
}

function removeUnusedImport(source) {
  // 按需
  // if (!source?.includes('import ')) {
  //   return source;
  // }
  return transformSync(source, {
    parserOpts,
    plugins: [
      [
        require('babel-plugin-danger-remove-unused-imports'),
        {
          ignore: 'rax'
        }
      ]
    ]
  }).code;
}

const codeProcessor = (processors = [], sourceCode) => processors
  .filter(processor => typeof processor === 'function')
  .reduce(
    (prevCode, currProcessor) => currProcessor(prevCode),
    sourceCode
  );

function eliminateDeadCode(source) {
  const processors = [
    removeDeadCode,
    removeUnusedImport,
  ];

  return codeProcessor(processors, source);
}

module.exports = eliminateDeadCode;
