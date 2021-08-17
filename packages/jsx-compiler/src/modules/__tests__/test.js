const {
  _transformCondition,
  _transformList,
  _transformClass,
  _transformFragment,
  _transformSlotDirective
} = require('../jsx-plus');
const { parseExpression } = require('../../parser');
const genExpression = require('../../codegen/genExpression');
const adapter = require('../../adapter').ali;

let count = 0;
let id = 0;
const code = `
<View>
  <View x-for={item in list} key={item.id}>{format(item.val)}</View>
</View>
`;
const ast = parseExpression(code);
_transformList({
  templateAST: ast
}, code, adapter);
const index = 'index' + count++;

console.log(genExpression(ast));