const { platformMap } = require('miniapp-builder-shared');

const addFileToCompilation = require('../utils/addFileToCompilation');
const platformConfig = require('../platforms');

function generatePageJS(
  compilation,
  pageRoute,
  {
    target,
    command,
    url
  }
) {
  const pageJsContent = `
function parseParams(query) {
  const paramString =  encodeURIComponent(Object.keys(query).map(key => {
    return \`\${key}=\${query[key]}\`
  }).join('&'));
  return paramString ? \`?\${paramString}\` : '';
}

Page({
  data: {
    url: "${url}",
    params: "",
  },
  onLoad: function(query) {
    this.setData({
      params: parseParams(query)
    });
  }
})
`;
  addFileToCompilation(compilation, {
    filename: `${pageRoute}.js`,
    content: pageJsContent,
    target,
    command
  });
}

function generatePageXML(
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

module.exports = {
  generatePageJS,
  generatePageXML
};
