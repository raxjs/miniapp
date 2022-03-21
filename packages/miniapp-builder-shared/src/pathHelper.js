const { join, relative, sep, resolve } = require('path');
const { existsSync, statSync, readJSONSync } = require('fs-extra');
const enhancedResolve = require('enhanced-resolve');
const targetPlatformMap = require('./platformMap');

const BUNDLE_NAME = 'bundle';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

function startsWith(prevString, nextString) {
  return prevString.indexOf(nextString) === 0;
}

function startsWithArr(prevString, nextStringArr = []) {
  return nextStringArr.some(nextString => startsWith(prevString, nextString));
}

function loadAsFile(module) {
  if (existsSync(module) && statSync(module).isFile()) {
    return module;
  }
  for (let e of extensions) {
    if (existsSync(module + e) && statSync(module + e).isFile()) {
      return module;
    }
  }
  return null;
}

function loadAsDirectory(module) {
  if (!existsSync(module)) {
    return null;
  }
  let stat = statSync(module);
  if (stat.isDirectory()) {
    for (let e of extensions) {
      const indexFile = join(module, `index${e}`);
      if (existsSync(indexFile) && statSync(indexFile).isFile()) {
        return join(module, 'index');
      }
    }
  } else if (stat.isFile()) {
    const result = loadAsFile(module);
    if (result) {
      return result;
    }
  }
  return null;
}

/**
 * Resolve relative path.
 * @param {string} script
 * @param {string} dependency
 * @param {boolean} checkSourceExistence
 * @return {string}
 */
function relativeModuleResolve(script, dependency, checkSourceExistence = true) {
  if (startsWithArr(dependency, ['./', '../', '/', '.\\', '..\\', '\\'])) {
    const dependencyPath = join(script, dependency);
    const processedPath = loadAsFile(dependencyPath) || loadAsDirectory(dependencyPath);
    if (checkSourceExistence && !processedPath) {
      throw new Error(`The page source ${dependencyPath} doesn't exist`);
    }

    return relative(
      script,
      processedPath || ''
    );
  } else throw new Error('The page source path does not meet the requirements');
};

/**
 * Use '/' as path sep regardless of OS when outputting the path to code
 * @param {string} filepath
 */
function normalizeOutputFilePath(filepath) {
  return filepath.replace(/\\/g, '/');
}

function getRelativePath(filePath) {
  let relativePath;
  if (filePath[0] === sep) {
    relativePath = `.${filePath}`;
  } else if (filePath[0] === '.') {
    relativePath = filePath;
  } else {
    relativePath = `.${sep}${filePath}`;
  }
  return relativePath;
}

/**
 * ./pages/foo -> based on src, return original
 * /pages/foo -> based on rootContext
 * pages/foo -> based on src, add prefix: './' or '.\'
 */
function getDepPath(rootDir, source, sourcePath = 'src') {
  if (source[0] === sep || source[0] === '.') {
    return join(rootDir, sourcePath, source);
  } else {
    return resolve(rootDir, sourcePath, source);
  }
}

/**
 * Resolve absolute path
 * @param  {...any} files
 */
function absoluteModuleResolve(...files) {
  return enhancedResolve.create.sync({
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.json']
  })(...files);
}

/**
 * get more specific files in miniapp
 * @param {string} platform
 * @param {string[]} extensions
 */
function getPlatformExtensions(platform, extensions = []) {
  return [
    ...platform ? extensions.map((ext) => `.${platform}${ext}`) : [],
    ...extensions,
  ];
}

/**
 * Judge whether the file is a native page according to the existence of the template file
 * @param {string} filePath
 * @param {string} target
 */
function isNativePage(filePath, target) {
  if (!targetPlatformMap[target]) return false;
  if (existsSync(filePath + targetPlatformMap[target].extension.xml)) {
    try {
      const jsonContent = readJSONSync(`${filePath}.json`);
      return !jsonContent.component;
    } catch (e) {}
    // If json file doesn't exist or not declare component: true, then it's a native page
    return true;
  }
  return false;
}

/**
 * Remove file extension
 * @param {string} filePath
 */
function removeExt(filePath) {
  const lastDot = filePath.lastIndexOf('.');
  return lastDot === -1 ? filePath : filePath.slice(0, lastDot);
}

/**
 * For jsx2mp-runtime and miniapp-render
 * Both of the packages should be dependency of its config package. But if the project has installed it, then it will take the priority.
 * @param {string} packageName
 * @param {string} rootDir
 */
function getHighestPriorityPackageJSON(packageName, rootDir) {
  const targetFile = join(packageName, 'package.json');
  const resolvePaths = require.resolve.paths(targetFile);
  resolvePaths.unshift(join(rootDir, 'node_modules'));
  const packageJSONPath = require.resolve(targetFile, {
    paths: resolvePaths
  });
  return packageJSONPath;
}

/**
 * Get bundle file path in runtime miniapp
 * @param {string} root
 */
function getBundlePath(root = '') {
  return join(root, BUNDLE_NAME);
}

module.exports = {
  relativeModuleResolve,
  normalizeOutputFilePath,
  getRelativePath,
  getDepPath,
  absoluteModuleResolve,
  getPlatformExtensions,
  isNativePage,
  removeExt,
  getHighestPriorityPackageJSON,
  getBundlePath
};
