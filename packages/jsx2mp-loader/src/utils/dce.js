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
  return transformSync(source, {
    parserOpts,
    plugins: [
      // 只传入插件名称时，云构建运行异常，babel 加载插件出错。所以必须增加 require()
      // Error: Cannot find module 'babel-plugin-remove-unused-reference'
      // Make sure that all the Babel plugins and presets you are using are defined as dependencies or devDependencies in your package.json file.
      require('babel-plugin-remove-unused-reference')
    ]
  }).code;
}

function removeUnusedImport(source) {
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
