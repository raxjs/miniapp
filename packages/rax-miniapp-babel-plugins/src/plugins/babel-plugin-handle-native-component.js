const { resolve, dirname, join } = require('path');
const { existsSync, readJSONSync } = require('fs-extra');
const {
  pathHelper: { absoluteModuleResolve, removeExt },
  platformMap
} = require('miniapp-builder-shared');
const extMap = require('../utils/extMap');
const { collectComponentAttr, collectUsings } = require('../utils/handleComponentAST');

const MINIAPP_COMPILED_DIR = 'miniapp-compiled';
const RELATIVE_COMPONENTS_REG = /^\./;

const baseComponents = [
  'rax-view',
  'rax-canvas',
  'rax-icon',
  'rax-image',
  'rax-picture',
  'rax-text',
  'rax-link',
  'rax-scrollview',
  'rax-recyclerview',
  'rax-slider',
  'rax-textinput',
  'rax-video',
  'rax-embed'
];

/**
 * Get native component npm path
 * @param {string} rootDir project root dir
 * @param {string} source module name
 * @param {string} target miniapp platform
 * @param {string[]} runtimeDependencies components that use runtime implementation
 *
 */
function getNpmSourcePath(rootDir, source, target, runtimeDependencies) {
  const modulePath = resolve(rootDir, 'node_modules', source);
  try {
    const pkgConfig = readJSONSync(join(modulePath, 'package.json'));
    const miniappConfig = pkgConfig.miniappConfig;
    if (!miniappConfig || baseComponents.includes(source) || isInRuntimeDependencies(source, runtimeDependencies)) {
      return source;
    }
    const miniappEntry = target === 'miniapp' ? miniappConfig.main : miniappConfig[`main:${platformMap[target].type}`];
    // Ensure component has target platform rax complie result
    if (!miniappEntry) {
      return source;
    }
    return join(source, miniappEntry);
  } catch (err) {
    return source;
  }
};

function getTmplPath(source, rootDir, dirName, target, runtimeDependencies) {
  // If it's a npm module, keep source origin value, otherwise use absolute path
  const isNpm = !RELATIVE_COMPONENTS_REG.test(source);
  let filePath = isNpm ? getNpmSourcePath(rootDir, source, target, runtimeDependencies) : resolve(dirName, source);
  const absPath = isNpm ? resolve(rootDir, 'node_modules', filePath) : filePath;
  if (!existsSync(`${absPath}.${extMap[target]}`)) return false;
  if (target === 'wechat-miniprogram') {
    // In Wechat MiniProgram need remove miniprogram_dist
    filePath = filePath.replace('/miniprogram_dist', '');
  }
  return isNpm ? filePath : `.${filePath.replace(resolve(rootDir, 'src'), '')}`;
}

/**
 * Get rax compiled component filepath
 * @param {string} dirName
 * @param {string} source
 */
function getCompiledComponentsPath(dirName, source) {
  if (!isMiniappCompiledFilePath(source)) {
    return false;
  }
  const filepath = removeExt(absoluteModuleResolve(dirName, source));
  // The returned value will be written into comp.json in `usingComponents`, which is under the same directory as miniapp-compiled
  return `./${filepath.substring(filepath.indexOf(MINIAPP_COMPILED_DIR))}`;
}


/**
 * Judge if the file is rax miniapp compiled component
 * @param {string} filePath
 */
function isMiniappCompiledFilePath(filePath) {
  return filePath.indexOf(MINIAPP_COMPILED_DIR) !== -1;
}

/**
 * Judge if the str is regexp
 * @param {string} str
 */
function isRegExpStr(str) {
  return str[0] === '/' && str[str.length - 1] === '/';
}

/**
 *
 * @param {string} dependency
 * @param {string[]} runtimeDependencies
 */
function isInRuntimeDependencies(dependency, runtimeDependencies = []) {
  for (let runtimeDependency of runtimeDependencies) {
    if (isRegExpStr(runtimeDependency)) {
      const reg = new RegExp(runtimeDependency.slice(1, -1));
      if (reg.test(dependency)) return true;
    } else if (runtimeDependency === dependency) return true;
  }
  return false;
}

function hasDefaultSpecifier(specifiers, t) {
  for (let specifier of specifiers) {
    if (t.isImportDefaultSpecifier(specifier)) return true;
  }
  return false;
}

module.exports = function visitor(
  { types: t },
  { usingComponents, target, rootDir, runtimeDependencies }
) {
  // Collect imported dependencies
  let nativeComponents = {};
  const scanedPageMap = {};
  return {
    visitor: {
      Program: {
        exit(path, { filename }) {
          scanedPageMap[filename] = false;
          nativeComponents = {};
        }
      },
      ImportDeclaration: {
        enter(path, { filename }) {
          const { specifiers, source } = path.node;
          // Don't scan files in miniapp-compiled directory
          if (Array.isArray(specifiers) && t.isStringLiteral(source) && !isMiniappCompiledFilePath(filename)) {
            const dirName = dirname(filename);
            const filePath = getTmplPath(source.value, rootDir, dirName, target, runtimeDependencies) || getCompiledComponentsPath(dirName, source.value);
            // TODO:
            // Temporarily ignore import { a, b } from 'xxx';
            if (filePath && hasDefaultSpecifier(specifiers, t)) {
              if (!scanedPageMap[filename]) {
                scanedPageMap[filename] = true;
                path.parentPath.traverse({
                  JSXOpeningElement: collectComponentAttr(nativeComponents, t)
                });
              }
              collectUsings(path, nativeComponents, usingComponents, filePath, t);
            }
          }
        },
      }
    },
  };
};
