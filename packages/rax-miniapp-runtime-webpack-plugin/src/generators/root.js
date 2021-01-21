const adapter = require('../adapter');
const ejs = require('ejs');
const addFileToCompilation = require('../utils/addFileToCompilation');
const getTemplate = require('../utils/getTemplate');

function generateRootTmpl(
  compilation,
  { usingPlugins, usingComponents, target, command, pluginDir }
) {
  const template = ejs.render(getTemplate(pluginDir, 'root.xml', target));
  const pluginTmpl = ejs.render(getTemplate(pluginDir, 'plugin.xml', target), {
    usingPlugins
  });
  const componentTmpl = ejs.render(getTemplate(pluginDir, 'custom-component.xml', target), {
    usingComponents
  });
  addFileToCompilation(compilation, {
    filename: `root.${adapter[target].xml}`,
    content: template + pluginTmpl + componentTmpl,
    target,
    command,
  });
  addFileToCompilation(compilation, {
    filename: `tool.${adapter[target].script}`,
    content: ejs.render(getTemplate(pluginDir, `tool.${adapter[target].script}`, target)),
    target,
    command,
  });
}

module.exports = {
  generateRootTmpl
};
