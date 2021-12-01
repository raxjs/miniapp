import { platformMap } from 'miniapp-builder-shared';

import addFileToCompilation from '../utils/addFileToCompilation';
import platformConfig from '../platforms';

export function generatePageJS(
  compilation,
  pageRoute,
  {
    target,
    command,
    url
  }
) {
  const pageJsContent = `
const bundle = require('./bundle');
Page(bundle.default("${url}"));  
`;
  addFileToCompilation(compilation, {
    filename: `${pageRoute}.js`,
    content: pageJsContent,
    target,
    command
  });
}

export function generatePageXML(
  compilation,
  pageRoute,
  {
    target,
    command,
  }
) {
  const pageXmlContent = platformConfig[target].templateXml;
  addFileToCompilation(compilation, {
    filename: `${pageRoute}${platformMap[target].extension.xml}`,
    content: pageXmlContent,
    target,
    command
  });
}