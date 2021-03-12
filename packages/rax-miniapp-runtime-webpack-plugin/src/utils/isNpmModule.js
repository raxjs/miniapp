module.exports = function isNpmModule(value) {
  return !(value[0] === '.' || value[0] === '/');
};
