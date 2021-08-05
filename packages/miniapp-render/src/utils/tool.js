/**
 * Hump to hyphen
 */
function toDash(str) {
  return str.replace(/[A-Z]/g, all => `-${all.toLowerCase()}`);
}

/**
 * Hyphen to hump
 */
function toCamel(str) {
  return str.replace(/-([a-zA-Z])/g, (all, $1) => $1.toUpperCase());
}

/**
 * Get unique id
 */
let seed = 0;
function getId() {
  return seed++;
}

/**
 * Check whether the variable is undefined
 * @param {*} variable
 * @returns boolean
 */
function isUndef(variable) {
  return variable === undefined;
}

/**
 * Check whether the variable is a function
 * @param {*} variable
 * @returns boolean
 */
 function isFunction(variable) {
  return typeof variable === 'function';
}

export {
  toDash,
  toCamel,
  getId,
  isUndef,
  isFunction
};
