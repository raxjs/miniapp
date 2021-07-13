const { join, dirname } = require('path');
const formatPath = require('../utils/formatPath');


/**
 * return {
 *  "routes": [
      {
        "path": "/",
        "source": "pages/Home/index",
        "component": fn,
      }
    ]
  }
 */


module.exports = function(pluginJSON) {
  const pluginConfig = JSON.parse(pluginJSON);

  const getRouteInfo = (page, source) => {
    const route = {
      path: `/${page}`,
      source
    };
    const pageSource = join(dirname(this.resourcePath), source);
    route.source = formatPath(pageSource).replace(`${formatPath(this.rootContext)}/src/`, '');

    const importComponentDirectly = `() => {
      function Component(props) {
        return createElement(require('${formatPath(pageSource)}').default, { pageConfig: ${JSON.stringify(route)}, ...props })
      }
      return Component;
    }`;

    // For rax-use-router lazy load page component
    const importComponent = `() => ${importComponentDirectly}`;

    return `routes.push(
      {
        ...${JSON.stringify(route)},
        component: ${importComponent}
      }
    );`;
  };

  const assembleRoutes = [];


  Object.keys(pluginConfig.pages).forEach((page) => {
    if (pluginConfig.pages[page]) {
      assembleRoutes.push(getRouteInfo(page, pluginConfig.pages[page]));
    }
  });

  return `
    import { createElement } from 'rax';
    const routes = [];
    ${assembleRoutes.join('\n')}
    const pluginConfig = {
      ...${pluginJSON},
      routes
    };
    export default pluginConfig;
  `;
};
