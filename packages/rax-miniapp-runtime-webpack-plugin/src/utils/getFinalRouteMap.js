module.exports = (finalStaticConfig) => {
  const routeMap = {};
  finalStaticConfig.routes.forEach(({ source, pageSource }) => {
    if (pageSource) {
      routeMap[source] = pageSource;
    } else {
      routeMap[source] = source;
    }
  });
  return routeMap;
};
