const { getDepPath, isNativePage } = require('./pathHelper');

/**
 * Filter native page
 * @param {Array} routes - user routes
 * @param {object} options - function options
 * @param {string} options.rootDir - project root directory
 * @param {string} options.target - user platform
 * @returns {Array}
 */
module.exports = (routes, { rootDir, target }) => {
  const nativeRoutes = [];
  const normalRoutes = [];
  routes.forEach((route) => {
    const pageEntry = getDepPath(rootDir, route.source);
    if (isNativePage(pageEntry, target)) {
      nativeRoutes.push(route);
    } else {
      normalRoutes.push(route);
    }
  });

  return {
    nativeRoutes,
    normalRoutes,
  };
};
