module.exports = (route) => {
  return route.name || route.source.replace(/\//g, '_');
};
