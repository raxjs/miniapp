const { resolve, extname } = require('path');
const { readFileSync } = require('fs-extra');
const { platformMap, constants: { BAIDU_SMARTPROGRAM } } = require('miniapp-builder-shared');
const { NEED_REPLACE_ROOT_TARGET } = require('../constants');
const addFileToCompilation = require('../utils/addFileToCompilation');
const getAssetPath = require('../utils/getAssetPath');
const adjustCSS = require('../utils/adjustCSS');

function generateAppJS(
  compilation,
  commonAppJSFilePaths,
  mainPackageRoot = 'main',
  { target, withNativeAppConfig }
) {
  const init =
`function init(window, document, app) {${commonAppJSFilePaths.map(filePath => `require('${getAssetPath(filePath, 'app.js')}')(window, document, app)`).join(';')}}`;
  const requireNativeAppConfig = withNativeAppConfig ? "const nativeAppConfig = require('./miniapp-native/app');" : 'const nativeAppConfig = {}';
  const appJsContent = `${requireNativeAppConfig}
const render = require('./render');
const config = require('./config');
${init}
App(render.createAppConfig(init, config, '${mainPackageRoot}', nativeAppConfig));
`;

  addFileToCompilation(compilation, {
    filename: 'app.js',
    content: appJsContent,
    target,
  });
}

function generateAppCSS(compilation, { target, pluginDir, subPackages, assets }) {
  const cssExt = platformMap[target].extension.css;
  // Add default css file to compilation
  const defaultCSSTmpl = adjustCSS(readFileSync(
    resolve(pluginDir, 'static', 'default.css'),
    'utf-8'
  ), NEED_REPLACE_ROOT_TARGET.has(target));
  // Generate __rax-view and __rax-text style for rax compiled components
  const raxDefaultCSSTmpl = readFileSync(
    resolve(pluginDir, 'static', 'rax-default.css'),
    'utf-8'
  );
  const defaultCSSContent = target === BAIDU_SMARTPROGRAM ? raxDefaultCSSTmpl : defaultCSSTmpl + raxDefaultCSSTmpl; // default CSS in baidu will cause render error
  const defaultCSSFileName = `default${cssExt}`;
  addFileToCompilation(compilation, {
    filename: `default${cssExt}`,
    content: defaultCSSContent,
    target,
  });

  let content = `@import "./${defaultCSSFileName}";`;

  Object.keys(assets).forEach(asset => {
    if (/\.css$/.test(asset) && asset !== defaultCSSFileName) {
      if (!subPackages || asset === 'vendors.css') {
        const newCssFileName = asset.replace(/\.css/, cssExt);
        // In sub packages mode, only vendors.css should be imported in app.css
        content += `@import "./${newCssFileName}";`;
      }
    }
  });

  addFileToCompilation(compilation, {
    filename: `app${platformMap[target].extension.css}`,
    content,
    target,
  });
}

module.exports = {
  generateAppJS,
  generateAppCSS
};
