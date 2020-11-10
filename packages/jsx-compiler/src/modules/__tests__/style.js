const t = require('@babel/types');
const { _transform } = require('../style');
const { parseExpression } = require('../../parser');
const genExpression = require('../../codegen/genExpression');
const genCode = require('../../codegen/genCode');

function genInlineCode(ast) {
  return genCode(ast, {
    comments: false, // Remove template comments.
    concise: true, // Reduce whitespace, but not to disable all.
  });
}

function genDynamicValue(dynamicValue) {
  const properties = [];
  const store = dynamicValue.getStore();
  store.map(({name, value}) => {
    properties.push(t.objectProperty(t.identifier(name), value));
  });
  return genInlineCode(t.objectExpression(properties)).code;
}

describe('Transform style', () => {
  it('should transform style props', () => {
    const raw = '<Text style={styles.name}>hello</Text>';
    const expected = '<Text style="{{_s0}}">hello</Text>';
    const expectedDynamicValue = '{ _s0: __create_style__(styles.name) }';
    const ast = parseExpression(raw);
    const { dynamicStyle } = _transform(ast);
    expect(genExpression(ast)).toEqual(expected);
    expect(genDynamicValue(dynamicStyle)).toEqual(expectedDynamicValue);
  });
});

describe('Transform className if using CSS modules', () => {
  it('should transform className props', () => {
    const raw = '<Text className={styles.name}>hello</Text>';
    const expected = '<Text className="name">hello</Text>';
    const ast = parseExpression(raw);
    _transform(ast, {
      'rax-text': [
        {
          local: 'Text',
          default: true,
          namespace: false,
          name: 'rax-text',
          isCustomEl: false
        }
      ],
      './index.module.css': [
        {
          local: 'styles',
          default: true,
          namespace: false,
          name: 'c-ed5081',
          isCustomEl: true
        }
      ],
      '../../components/Logo': [
        {
          local: 'Logo',
          default: true,
          namespace: false,
          name: 'c-d25621',
          isCustomEl: true
        }
      ]
    });
    expect(genExpression(ast)).toEqual(expected);
  });
});
