/**
 * @fileoverview no spread operator
 * @author hirra
 */
'use strict';

const { baseComponents } = require('../utils');

const { docUrl } = require('../utils');

const TYPE = {
  JSXExpressionContainer: 'JSXExpressionContainer',
  ArrowFunctionExpression: 'ArrowFunctionExpression',
  BlockStatement: 'BlockStatement',
  VariableDeclaration: 'VariableDeclaration',
  ExpressionStatement: 'ExpressionStatement',
  BinaryExpression: 'BinaryExpression',
  CallExpression: 'CallExpression',
  MemberExpression: 'MemberExpression',
  Identifier: 'Identifier',
  AssignmentExpression: 'AssignmentExpression',
  UpdateExpression: 'UpdateExpression',
};

const isBlockStatement = (node) => {
  return (
    node.value &&
    node.value.type === TYPE.JSXExpressionContainer &&
    node.value.expression &&
    node.value.expression.type === TYPE.ArrowFunctionExpression &&
    node.value.expression.body.type === TYPE.BlockStatement
  );
};

const isBaseComponent = (node, importedList) => {
  if (importedList.includes(node.parent.name && node.parent.name.name)) {
    return true;
  }
  return false;
};

const findMapCallbackParams = (node) => {
  if (!node || !node.parent) {
    return [];
  }
  if (node.type === TYPE.CallExpression && node.callee.property && node.callee.property.name === 'map') {
    return node.arguments[0].params.map((p) => p.name);
  }

  return findMapCallbackParams(node.parent);
};

module.exports = {
  meta: {
    docs: {
      description: 'no temporary variable in loop render',
      url: docUrl('no_temp_variable_in_loop_render'),
      recommended: false,
    },
    messages: {
      noTempVariableInLoopRender:
        'Do not use temporary variable like "item" or "index" in loop render,' +
        'if necessary, use CallExpression instead of BlockStatement. e.g. <View onClick={() => handleClick(index)}> '
    },
  },

  create: function(context) {
    const importedList = [];
    return {
      ImportDefaultSpecifier: (node) => {
        if (node.local && node.local.name) {
          if (baseComponents.includes(node.parent.source.value)) {
            importedList.push(node.local.name);
          }
        }
      },
      VariableDeclarator: (node) => {
        if (node.id && node.id.name) {
          if (node.init && node.init.callee === 'require') {
            if (Array.isArray(node.init.arguments) && baseComponents.includes(node.init.arguments[0].value)) {
              importedList.push(node.local.name);
            }
          }
        }
      },
      JSXAttribute: (node) => {
        if (!isBaseComponent(node, importedList)) {
          return;
        }
        if (isBlockStatement(node)) {
          const temporaryParams = findMapCallbackParams(node);
          const checker = new Checker(context, temporaryParams);
          checker.check(node);
        }
      },
    };
  },
};

class Checker {
  constructor(context, params) {
    this.params = params;
    this.context = context;
    this.checkBody = this.checkBody.bind(this);
    this.checkNode = this.checkNode.bind(this);
    this.checkIdentifier = this.checkIdentifier.bind(this);
    this.checkCallExpression = this.checkCallExpression.bind(this);
    this.checkMemberExpression = this.checkMemberExpression.bind(this);
    this.checkBinaryExpression = this.checkBinaryExpression.bind(this);
    this.checkAssignmentExpression = this.checkAssignmentExpression.bind(this);
    this.checkUpdateExpression = this.checkUpdateExpression.bind(this);
    this.handleParam = this.handleParam.bind(this);
    this.traverseVariableDeclaration = this.traverseVariableDeclaration.bind(this);
  }

  check(node) {
    const bodys = node.value.expression.body.body;
    bodys.forEach(this.checkBody);
  }

  checkBody(node) {
    if (node.type === TYPE.VariableDeclaration) {
      node.declarations.forEach((child) => {
        this.traverseVariableDeclaration(child);
      });
    }

    const nodesToCheck =
      node.type === TYPE.VariableDeclaration
        ? node.declarations.map((declaration) => declaration.init)
        : node.type === TYPE.ExpressionStatement ? [node.expression] : [];

    nodesToCheck.forEach((node) => {
      const hasParam = this.checkNode(node);
      if (hasParam) {
        this.context.report({
          node,
          messageId: 'noTempVariableInLoopRender',
        });
      }
    });
  }

  // handle:  `const { target: { dataset: { item } = {} } = {} } = e , c = xx;`
  traverseVariableDeclaration(node) {
    const handleParam = this.handleParam.bind(this);

    if (node.id && node.id.type === 'Identifier') {
      handleParam(node.id.name);
    }

    if (node.id && node.id.type === 'ObjectPattern') {
      resecureVariable(node.id);
    }

    function resecureVariable(node) {
      if (node.properties && Array.isArray(node.properties)) {
        node.properties.forEach((prop) => {
          if (prop.type === 'Identifier') {
            handleParam(prop.name);
          } else if (prop.type === 'Property') {
            if (!prop.value.left) {
              handleParam(prop.value.name);
            } else if (prop.value.left.type === 'ObjectPattern') {
              resecureVariable(prop.value.left);
            } else if (prop.value.left.type === 'Identifier') {
              handleParam(prop.value.left.name);
            }
          }
        });
      }
    }
  }

  handleParam(name) {
    if (this.params.includes(name)) {
      this.params.splice(this.params.indexOf(name), 1);
    }
  }

  checkNode(node) {
    const { type } = node;
    const checkFn = this[`check${type}`];
    const hasParam = checkFn ? checkFn(node) : false;

    return hasParam;
  }

  checkIdentifier(node) {
    return this.params.includes(node.name);
  }

  checkCallExpression(node) {
    const params = this.params;
    // index(), index.a()

    if (params.includes(node.callee.name || node.callee.object.name)) {
      return true;
    }

    // foo(index), foo.bar(0, index)

    return node.arguments.some((arg) => arg.type === TYPE.Identifier && params.includes(arg.name));
  }

  // index.a

  checkMemberExpression(node) {
    return this.params.includes(node.object.name);
  }

  // 3 + index

  checkBinaryExpression(node) {
    return this.checkNode(node.left) || this.checkNode(node.right);
  }

  // index.a = 1

  checkAssignmentExpression(node) {
    return this.checkNode(node.left) || this.checkNode(node.right);
  }

  // index++

  checkUpdateExpression(node) {
    return this.params.includes(node.argument.name);
  }
}
