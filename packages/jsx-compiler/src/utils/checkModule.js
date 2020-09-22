const WEEX_MODULE_REG = /^@?weex-/;

function isWeexModule(value) {
  return WEEX_MODULE_REG.test(value);
}

function isNpmModule(value) {
  return !(value[0] === '.' || value[0] === '/');
}

function isFilenameCSS(value) {
  return /\.(css|sass|less|scss|styl)$/i.test(value);
}

function isNpmCSS(value) {
  return isFilenameCSS(value) && (isNpmModule(value) || value.indexOf('npm') > -1);
}


module.exports = {
  isWeexModule,
  isNpmModule,
  isFilenameCSS,
  isNpmCSS
};
