const ejs = require('ejs');
const { join } = require('path');
const adapter = require('../adapter');
const getAssetPath = require('../utils/getAssetPath');
const addFileToCompilation = require('../utils/addFileToCompilation');
const getTemplate = require('../utils/getTemplate');
const { MINIAPP } = require('../constants');

function generatePageCSS(
  compilation,
  pageRoute,
  { target, command }
) {
  const pageCssContent = '/* required by usingComponents */';

  addFileToCompilation(compilation, {
    filename: `${pageRoute}.${adapter[target].css}`,
    content: pageCssContent,
    target,
    command,
  });
}

function generatePageJS(
  compilation,
  pageRoute,
  nativeLifeCycles = {},
  { target, command, rootDir, outputPath }
) {
  const pageJsContent = ejs.render(getTemplate(rootDir, 'page.js'), {
    render_path: `${getAssetPath(join(outputPath, 'render.js'), join(outputPath, `${pageRoute}.js`))}`,
    route: pageRoute,
    native_lifecycles: `[${Object.keys(nativeLifeCycles).reduce((total, current, index) =>
      index === 0 ? `${total}'${current}'` : `${total},'${current}'`, '')}]`
  });

  addFileToCompilation(compilation, {
    filename: `${pageRoute}.js`,
    content: pageJsContent,
    target,
    command,
  });
}

function generatePageXML(
  compilation,
  pageRoute,
  useComponent,
  { target, command, outputPath }
) {
  let pageXmlContent;
  if (target === MINIAPP && useComponent) {
    pageXmlContent = '<element r="{{root}}"  />';
  } else {
    const rootTmplFileName = 'root.' + adapter[target].xml;
    const pageTmplFilePath = `${pageRoute}.` + adapter[target].xml;
    pageXmlContent = `<import src="${getAssetPath(join(outputPath, rootTmplFileName), join(outputPath, pageTmplFilePath))}"/>
    <template is="element" data="{{r: root}}"  />`;
  }

  addFileToCompilation(compilation, {
    filename: `${pageRoute}.${adapter[target].xml}`,
    content: pageXmlContent,
    target,
    command,
  });
}

function generatePageJSON(
  compilation,
  pageConfig,
  useComponent,
  pageRoute,
  { target, command, outputPath }
) {
  if (!pageConfig.usingComponents) {
    pageConfig.usingComponents = {};
  }
  const elementPath = getAssetPath(
    join(outputPath, 'comp'),
    join(outputPath, `${pageRoute}.js`)
  );
  if (useComponent || target !== MINIAPP) {
    pageConfig.usingComponents.element = elementPath;
  }

  addFileToCompilation(compilation, {
    filename: `${pageRoute}.json`,
    content: JSON.stringify(pageConfig, null, 2),
    target,
    command,
  });
}

module.exports = {
  generatePageCSS,
  generatePageJS,
  generatePageJSON,
  generatePageXML
};
