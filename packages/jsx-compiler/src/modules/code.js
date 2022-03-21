const t = require('@babel/types');
const { join, relative, dirname, resolve, extname } = require('path');
const resolveModule = require('resolve');
const { parseExpression } = require('../parser');
const isClassComponent = require('../utils/isClassComponent');
const isFunctionComponent = require('../utils/isFunctionComponent');
const traverse = require('../utils/traverseNodePath');
const { isNpmModule, isWeexModule } = require('../utils/checkModule');
const { getNpmName, normalizeFileName, addRelativePathPrefix, normalizeOutputFilePath, SCRIPT_FILE_EXTENSIONS } = require('../utils/pathHelper');

const RAX_PACKAGE = 'rax';
const SUPER_COMPONENT = 'Component';
const SHARED = 'shared';
const MEMO = 'memo';

const CREATE_COMPONENT = 'createComponent';
const CREATE_PAGE = 'createPage';
const CREATE_STYLE = 'createStyle';
const CLASSNAMES = 'classnames';
const CREATE_CONTEXT = 'createContext';
const FORWARD_REF = 'forwardRef';
const CREATE_REF = 'createRef';

const SAFE_SUPER_COMPONENT = '__component__';
const SAFE_CREATE_COMPONENT = '__create_component__';
const SAFE_CREATE_PAGE = '__create_page__';
const SAFE_CREATE_STYLE = '__create_style__';
const SAFE_CLASSNAMES = '__classnames__';
const SAFT_DEFAULT_NAME = '__default_name__';

const USE_EFFECT = 'useEffect';
const USE_STATE = 'useState';
const USE_CONTEXT = 'useContext';
const USE_REF = 'useRef';
const USE_REDUCER = 'useReducer';
const USE_LAYOUT_EFFECT = 'useLayoutEffect';
const USE_IMPERATIVEHANDLE = 'useImperativeHandle';
const USE_MEMO = 'useMemo';
const USE_CALLBACK = 'useCallback';

const EXPORTED_DEF = '__def__';
const RUNTIME = 'jsx2mp-runtime';

const coreMethodList = [USE_EFFECT, USE_STATE, USE_CONTEXT, USE_REF, CREATE_REF,
  USE_REDUCER, USE_LAYOUT_EFFECT, USE_IMPERATIVEHANDLE, FORWARD_REF, CREATE_CONTEXT, SHARED,
  USE_CALLBACK, USE_MEMO, MEMO];

const getRuntimeByPlatform = (platform) => `${RUNTIME}/dist/jsx2mp-runtime.${platform}.esm`;
const isAppRuntime = (mod) => mod === 'rax-app';
const isFileModule = (mod) => /\.(png|jpe?g|gif|bmp|webp)$/.test(mod);
const isRelativeImport = (mod) => mod[0] === '.';

function getConstructor(type) {
  switch (type) {
    case 'app': return 'App';
    case 'page': return 'Page';
    case 'component':
    default: return 'Component';
  }
}
/**
 * Module code transform.
 * 1. Add import declaration of helper lib.
 * 2. Rename scope's Component to other id.
 * 3. Add Component call expression.
 * 4. Transform 'rax' to 'rax/dist/rax.min.js' in case of 小程序开发者工具 not support `process`.
 */
module.exports = {
  parse(parsed, code, options) {
    const { ast, programPath, defaultExportedPath, exportComponentPath, renderFunctionPath,
      useCreateStyle, useClassnames, dynamicValue, dynamicRef, dynamicStyle, dynamicEvents, imported,
      contextList, refs, componentDependentProps, listKeyProps, renderItemFunctions, renderPropsFunctions, renderPropsEmitter, renderPropsListener, eventHandler, eventHandlers = [] } = parsed;
    const { platform, type, cwd, outputPath, sourcePath, resourcePath, disableCopyNpm, virtualHost } = options;
    if (type !== 'app' && (!defaultExportedPath || !defaultExportedPath.node)) {
      // Can not found default export, otherwise app.js is excluded.
      return;
    }
    let userDefineType;

    if (type === 'app') {
      userDefineType = 'function';
    } else {
      const replacer = getReplacer(exportComponentPath);
      let { id, body } = exportComponentPath.node;
      if (!id) {
        // Check fn is anonymous
        if (exportComponentPath.parentPath.isVariableDeclarator()) {
          id = exportComponentPath.parent.id;
        } else {
          id = t.identifier(SAFT_DEFAULT_NAME);
        }
      }
      if (isFunctionComponent(exportComponentPath)) { // replace with class def.
        userDefineType = 'function';
        const { generator, async, params } = exportComponentPath.node;
        if (replacer) {
          replacer.replaceWith(
            t.functionDeclaration(id, params, body, generator, async)
          );
        }
      } else if (isClassComponent(exportComponentPath)) {
        userDefineType = 'class';
        if (id.name === SAFT_DEFAULT_NAME) {
          // Suport export default class extends Component {}
          exportComponentPath.node.id = id;
        }
        // Replace Component use __component__
        renameComponentClassDeclaration(ast);
      }
      replacer.insertAfter(t.variableDeclaration('let', [
        t.variableDeclarator(
          t.identifier(EXPORTED_DEF), id)
      ]));
    }
    const exportedVariables = collectCoreMethods(imported[RAX_PACKAGE] || []);
    const targetFileDir = type === 'app' ? outputPath : dirname(join(outputPath, relative(sourcePath, resourcePath)));
    // When compiling app.js, if using subpackages, then outputPath is fixed but resourcePath is not src/app.js
    const runtimePath = getRuntimePath(outputPath, targetFileDir, platform, disableCopyNpm);
    removeRaxImports(ast);
    ensureIndexPathInImports(ast, sourcePath, resourcePath, type); // In WeChat miniapp, `require` can't get index file if index is omitted
    renameCoreModule(ast, runtimePath);
    renameFileModule(ast);
    renameAppConfig(ast, sourcePath, resourcePath, type);

    if (!disableCopyNpm) {
      renameNpmModules(ast, targetFileDir, outputPath, cwd, resourcePath);
    }

    if (type !== 'app') {
      addDefine({programPath, type, userDefineType, eventHandlers, useCreateStyle, useClassnames, exportedVariables, runtimePath, virtualHost});
    }

    removeDefaultImports(ast);

    /**
     * updateChildProps: collect props dependencies.
     */
    if (type !== 'app' && renderFunctionPath) {
      const fnBody = renderFunctionPath.node.body.body;
      let firstReturnStatementIdx = -1;
      for (let i = 0, l = fnBody.length; i < l; i++) {
        if (t.isReturnStatement(fnBody[i])) firstReturnStatementIdx = i;
      }

      const updateProps = t.memberExpression(t.identifier('this'), t.identifier('_updateChildProps'));
      const getTagId = t.memberExpression(t.identifier('this'), t.identifier('_getUniqKey'));
      const componentsDependentProps = componentDependentProps || {};
      let isAddUpdateProps = false;

      const listsKeyProps = listKeyProps || {};
      Object.keys(listsKeyProps).forEach((renamedIndex) => {
        const { originalKey, renamedKey, parentNode } = listsKeyProps[renamedIndex];
        // const key2 = this._getUniqKey ? this._getUniqKey('index2', item.key, index2) : index2;
        const getTagIdArgs = [
          t.stringLiteral(renamedIndex + ''),
          originalKey,
          t.identifier(renamedIndex)
        ];
        const conditionExp = t.conditionalExpression(
          getTagId,
          t.callExpression(getTagId, getTagIdArgs),
          t.identifier(renamedIndex)
        );
        const keyDeclaration = t.variableDeclaration('const', [
          t.variableDeclarator(renamedKey, conditionExp)
        ]);

        const targetNode = parentNode || fnBody;
        isAddUpdateProps = true;
        targetNode.unshift(keyDeclaration);
      });

      Object.keys(componentsDependentProps).forEach((tagId) => {
        const { props, tagIdExpression, parentNode } = componentsDependentProps[tagId];

        // Setup propMaps.
        const propMaps = [];
        props && Object.keys(props).forEach(key => {
          const value = props[key];
          propMaps.push(t.objectProperty(
            t.stringLiteral(key),
            value
          ));
        });
        if (propMaps.length > 0) {
          let argPIDExp = tagIdExpression
            ? genTagIdExp(tagIdExpression)
            : t.stringLiteral(tagId);

          // this._updateChildProps(1 + '-' + key1 + '-' + key2 ,{});
          const updatePropsArgs = [
            argPIDExp,
            t.objectExpression(propMaps)
          ];
          const callUpdateProps = t.expressionStatement(t.callExpression(updateProps, updatePropsArgs));

          const targetNode = parentNode || fnBody;

          if (t.isReturnStatement(targetNode[targetNode.length - 1])) {
            targetNode.splice(targetNode.length - 1, 0, callUpdateProps);
          } else {
            targetNode.push(callUpdateProps);
          }
        } else if ((parentNode || fnBody).length === 0) {
          // Remove empty loop exp.
          parentNode && parentNode.remove && parentNode.remove();
        }
      });
      addRenderPropsEmitter(renderPropsEmitter, renderFunctionPath);
      addRenderPropsListener(renderPropsListener, renderFunctionPath);
      addUpdateData(dynamicValue, dynamicRef, dynamicStyle, renderItemFunctions, renderPropsFunctions, renderFunctionPath);
      addUpdateEvent(dynamicEvents, eventHandler, renderFunctionPath);
      if (isAddUpdateProps) {
        addClearKeyCache(renderFunctionPath);
      }
      addProviderIniter(contextList, renderFunctionPath);
      addRegisterRefs(refs, renderFunctionPath);
    }
  },
};

function genTagIdExp(expressions, isPre) {
  let ret = '';
  const l = isPre ? expressions.length - 1 : expressions.length;
  for (let i = 0; i < l; i++) {
    if (expressions[i] && expressions[i].isExpression) {
      ret += expressions[i];
    } else {
      ret += JSON.stringify(expressions[i]);
    }
    if (i !== l - 1) ret += ' + "-" + ';
  }
  return parseExpression(ret);
}

function getRuntimePath(outputPath, targetFileDir, platform, disableCopyNpm) {
  let runtimePath = getRuntimeByPlatform(platform.type);
  if (!disableCopyNpm) {
    runtimePath = addRelativePathPrefix(normalizeOutputFilePath(relative(targetFileDir, join(outputPath, 'npm', RUNTIME))));
  }
  return runtimePath;
}

function renameCoreModule(ast, runtimePath) {
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.get('source');
      if (source.isStringLiteral() && isAppRuntime(source.node.value)) {
        source.replaceWith(t.stringLiteral(runtimePath));
      }
    }
  });
}

function renameComponentClassDeclaration(ast) {
  traverse(ast, {
    ClassDeclaration(path) {
      const superClassPath = path.get('superClass');
      if (superClassPath && t.isIdentifier(superClassPath.node, {
        name: SUPER_COMPONENT
      })) {
        superClassPath.replaceWith(t.identifier(SAFE_SUPER_COMPONENT));
      }
    }
  });
}

// import img from '../assets/img.png' => const img = '../assets/img.png'
function renameFileModule(ast) {
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.get('source');
      if (source.isStringLiteral() && isFileModule(source.node.value)) {
        source.parentPath.replaceWith(t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier(path.get('specifiers')[0].node.local.name),
            t.stringLiteral(source.node.value)
          )
        ]));
      }
    }
  });
}

/**
 * Rename app.json to app.config.js, for prev is compiled to adapte miniapp.
 * eg:
 *   import appConfig from './app.json' => import appConfig from './app.config.js'
 * @param ast Babel AST.
 * @param sourcePath Folder path to source.
 * @param resourcePath Current handling file source path.
 */
function renameAppConfig(ast, sourcePath, resourcePath, type) {
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.get('source');
      if (source.isStringLiteral()) {
        if (isImportAppJSON(source.node.value, resourcePath, sourcePath, type)) {
          const replacement = source.node.value.replace(/app\.json/, 'app.config.js');
          source.replaceWith(t.stringLiteral(replacement));
        }
      }
    }
  });
}

function ensureIndexPathInImports(ast, sourcePath, resourcePath, type) {
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.get('source');
      if (source.isStringLiteral() && isRelativeImport(source.node.value) && !isImportAppJSON(source.node.value, resourcePath, sourcePath, type)) {
        const replacement = ensureIndexInPath(source.node.value, sourcePath, resourcePath, type);
        source.replaceWith(t.stringLiteral(replacement));
      }
    }
  });
}

function renameNpmModules(ast, targetFileDir, outputPath, cwd, resourcePath) {
  const source = (value, targetFileDir, outputPath, rootContext) => {
    const npmName = getNpmName(value);
    const nodeModulePath = join(rootContext, 'node_modules');
    const searchPaths = [nodeModulePath];
    // Use resolve instead of require.resolve because require.resolve will read the exports field first, which is not expected
    const target = resolveModule.sync(npmName, { basedir: dirname(resourcePath), paths: searchPaths, preserveSymlinks: false });
    // In tnpm, target will be like following (symbol linked path):
    // ***/_universal-toast_1.0.0_universal-toast/lib/index.js
    let packageJSONPath;
    try {
      packageJSONPath = require.resolve(join(npmName, 'package.json'), { paths: searchPaths });
    } catch (err) {
      throw new Error(`You may not have npm installed: "${npmName}"`);
    }

    const moduleBasePath = join(packageJSONPath, '..');
    const realNpmName = relative(nodeModulePath, moduleBasePath);
    const modulePathSuffix = relative(moduleBasePath, target);

    let ret;
    if (npmName === value) {
      ret = relative(targetFileDir, join(outputPath, 'npm', realNpmName, modulePathSuffix));
    } else {
      ret = relative(targetFileDir, join(outputPath, 'npm', value.replace(npmName, realNpmName)));
    }
    ret = addRelativePathPrefix(normalizeOutputFilePath(ret));
    // ret => '../npm/_ali/universal-toast/lib/index.js

    return t.stringLiteral(normalizeFileName(ret));
  };

  traverse(ast, {
    ImportDeclaration(path) {
      const { value } = path.node.source;
      if (isWeexModule(value)) {
        path.remove();
      } else if (isNpmModule(value)) {
        path.node.source = source(value, targetFileDir, outputPath, cwd);
      }
    }
  });
}

function addDefine({programPath, type, userDefineType, eventHandlers, useCreateStyle, useClassnames, exportedVariables, runtimePath, virtualHost}) {
  let safeCreateInstanceId;
  let importedIdentifier;
  switch (type) {
    case 'page':
      safeCreateInstanceId = SAFE_CREATE_PAGE;
      importedIdentifier = CREATE_PAGE;
      break;
    case 'component':
      safeCreateInstanceId = SAFE_CREATE_COMPONENT;
      importedIdentifier = CREATE_COMPONENT;
      break;
  }
  const localIdentifier = t.identifier(safeCreateInstanceId);
  // Component(__create_component__(__class_def__));
  const args = [t.identifier(EXPORTED_DEF)];

  // import { createComponent as __create_component__ } from "/__helpers/component";
  const specifiers = [t.importSpecifier(localIdentifier, t.identifier(importedIdentifier))];
  if ((type === 'page' || type === 'component') && userDefineType === 'class') {
    specifiers.push(t.importSpecifier(
      t.identifier(SAFE_SUPER_COMPONENT),
      t.identifier(SUPER_COMPONENT)
    ));
  }

  if (Array.isArray(exportedVariables)) {
    exportedVariables.forEach(id => {
      specifiers.push(t.importSpecifier(t.identifier(id), t.identifier(id)));
    });
  }
  if (useCreateStyle) {
    specifiers.push(t.importSpecifier(
      t.identifier(SAFE_CREATE_STYLE),
      t.identifier(CREATE_STYLE)
    ));
  }

  if (useClassnames) {
    specifiers.push(t.importSpecifier(
      t.identifier(SAFE_CLASSNAMES),
      t.identifier(CLASSNAMES)
    ));
  }

  programPath.node.body.unshift(
    t.importDeclaration(
      specifiers,
      t.stringLiteral(runtimePath)
    )
  );

  const optionsVariableProperties = [];
  // __create_component__(__class_def__, { baseConfig: { virtualHost: true }})
  if (type === 'component' && virtualHost) {
    const baseConfig = t.objectProperty(
      t.identifier('baseConfig'),
      t.objectExpression([t.objectProperty(t.identifier('virtualHost'), t.booleanLiteral(true))])
    );
    optionsVariableProperties.push(baseConfig);
  }

  // __create_component__(__class_def__, { events: ['_e*']})
  if (eventHandlers.length > 0) {
    const events = t.objectProperty(t.identifier('events'), t.arrayExpression(eventHandlers.map(e => t.stringLiteral(e))));
    optionsVariableProperties.push(events);
  }

  args.push(t.objectExpression(optionsVariableProperties));

  programPath.node.body.push(
    t.expressionStatement(
      t.callExpression(
        t.identifier(getConstructor(type)),
        [
          t.callExpression(
            t.identifier(safeCreateInstanceId),
            args
          )
        ],
      )
    )
  );
}

function removeRaxImports(ast) {
  traverse(ast, {
    ImportDeclaration(path) {
      if (t.isStringLiteral(path.node.source, { value: RAX_PACKAGE })) {
        path.remove();
      }
    },
  });
}

function removeDefaultImports(ast) {
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const { node: { declaration } } = path;
      if (/Expression$/.test(declaration.type)) {
        path.replaceWith(t.assignmentExpression('=', t.identifier(EXPORTED_DEF), declaration));
      } else {
        path.replaceWith(declaration);
      }
    },
  });
}

function getReplacer(exportComponentPath) {
  if (exportComponentPath.parentPath.isExportDefaultDeclaration()) {
    /**
     * export default class {};
     */
    return exportComponentPath.parentPath;
  } else if (exportComponentPath.parentPath.isProgram()) {
    /**
     * class Foo {}
     * export default Foo;
     */
    return exportComponentPath;
  } else if (exportComponentPath.parentPath.isVariableDeclarator()) {
    /**
     * var Foo = class {}
     * export default Foo;
     */
    return exportComponentPath.parentPath.parentPath;
  } else {
    return null;
  }
}

/**
 * Collect core methods, like createContext or createRef
 * */
function collectCoreMethods(raxExported) {
  const vaildList = [];
  raxExported.forEach(exported => {
    if (coreMethodList.indexOf(exported.local) > -1) {
      vaildList.push(exported.local);
    }
  });
  return vaildList;
}

function addRenderPropsEmitter(renderPropsEmitter = [], renderFunctionPath) {
  if (renderPropsEmitter.length > 0) {
    renderPropsEmitter.forEach(emitter => {
      renderFunctionPath.node.body.body.push(emitter);
    });
  }
}

function addRenderPropsListener(renderPropsListener = [], renderFunctionPath) {
  if (renderPropsListener.length > 0) {
    renderPropsListener.forEach(listener => {
      const fnBody = renderFunctionPath.node.body.body;
      const [renderClosureFunction, callOnRenderPropsUpdate] = listener;
      fnBody.unshift(renderClosureFunction);
      fnBody.push(callOnRenderPropsUpdate);
    });
  }
}

function addUpdateData(dynamicValue, dynamicRef, dynamicStyle, renderItemFunctions, renderPropsFunctions, renderFunctionPath) {
  const dataProperties = [];
  const dataStore = dynamicValue.getStore();
  const refStore = dynamicRef.getStore();
  const styleStore = dynamicStyle.getStore();
  [...dataStore, ...refStore, ...styleStore].forEach(({name, value}) => {
    dataProperties.push(t.objectProperty(t.stringLiteral(name), value));
  });

  renderItemFunctions.map(renderItemFn => {
    dataProperties.push(t.objectProperty(t.stringLiteral(renderItemFn.name), renderItemFn.node));
  });
  renderPropsFunctions.map(renderPropsFn => {
    dataProperties.push(t.objectProperty(t.stringLiteral(renderPropsFn.name), renderPropsFn.node));
  });

  const updateData = t.memberExpression(
    t.thisExpression(),
    t.identifier('_updateData')
  );

  const fnBody = renderFunctionPath.node.body.body;
  fnBody.push(t.expressionStatement(t.callExpression(updateData, [
    t.objectExpression(dataProperties)
  ])));
}

function addUpdateEvent(dynamicEvent, eventHandlers = [], renderFunctionPath) {
  const methodsProperties = [];
  dynamicEvent.forEach(({ name, value }) => {
    eventHandlers.push(name);
    methodsProperties.push(t.objectProperty(t.stringLiteral(name), value));
  });

  const updateMethods = t.memberExpression(
    t.thisExpression(),
    t.identifier('_updateMethods')
  );
  const fnBody = renderFunctionPath.node.body.body;

  fnBody.push(t.expressionStatement(t.callExpression(updateMethods, [
    t.objectExpression(methodsProperties)
  ])));
}

function addProviderIniter(contextList, renderFunctionPath) {
  if (contextList) {
    contextList.forEach(ctx => {
      const ProviderIniter = t.memberExpression(
        t.identifier(ctx.contextName),
        t.identifier('Provider')
      );
      const fnBody = renderFunctionPath.node.body.body;
      const args = ctx.contextInitValue ? [ctx.contextInitValue] : [];
      fnBody.push(t.expressionStatement(t.callExpression(ProviderIniter, args)));
    });
  }
}

/**
 * Insert register ref method
 * @param {Array} refs
 * @param {Object} renderFunctionPath
 * */
function addRegisterRefs(refs, renderFunctionPath) {
  const registerRefsMethods = t.memberExpression(
    t.thisExpression(),
    t.identifier('_registerRefs')
  );
  const fnBody = renderFunctionPath.node.body.body;
  /**
   * this._registerRefs([
   *  {
   *    name: 'scrollViewRef',
   *    method: scrollViewRef
   *  }
   * ])
   * */
  if (refs.length > 0) {
    fnBody.push(t.expressionStatement(t.callExpression(registerRefsMethods, [
      t.arrayExpression(refs.map(ref => {
        return t.objectExpression([t.objectProperty(t.stringLiteral('name'), ref.name),
          t.objectProperty(t.stringLiteral('method'), ref.method ),
          t.objectProperty(t.stringLiteral('type'), ref.type ),
          t.objectProperty(t.stringLiteral('id'), ref.id )]);
      }))
    ])));
  }
}

/**
 * add index if it's omitted
 *
 * @param {string} value  imported value
 * @param {string} resourcePath current file path
 * @returns
 */
function ensureIndexInPath(value, sourcePath, resourcePath, type) {
  const target = resolveModule.sync(resolve(dirname(resourcePath), value), {
    extensions: SCRIPT_FILE_EXTENSIONS
  });
  const result = relative(dirname(type === 'app' ? join(sourcePath, 'app') : resourcePath), target);
  return removeJSExtension(addRelativePathPrefix(normalizeOutputFilePath(result)));
};

function removeJSExtension(filePath) {
  const ext = extname(filePath);
  if (SCRIPT_FILE_EXTENSIONS.indexOf(ext) > -1) {
    return filePath.slice(0, filePath.length - ext.length);
  }
  return filePath;
}
/**
 * check whether import app.json
 * @param {string} mod imported module name
 * @param {string} resourcePath current file path
 * @param {string} sourcePath src path
 * @param {string} type build file type 'app'|'page'|'component'
 */
function isImportAppJSON(mod, resourcePath, sourcePath, type) {
  const appConfigSourcePath = type === 'app' ? join(dirname(resourcePath), 'app.json') : join(sourcePath, 'app.json');
  return resolve(dirname(resourcePath), mod) === appConfigSourcePath;
}


function addClearKeyCache(renderFunctionPath) {
  const fnBody = renderFunctionPath.node.body.body;
  // this._clearKeyCache && this._clearKeyCache();
  const clearExp = t.memberExpression(t.thisExpression(), t.identifier('_clearKeyCache'));
  fnBody.push(
    t.expressionStatement(
      t.logicalExpression('&&',
        clearExp,
        t.callExpression(clearExp, [])
      )
    )
  );
}
