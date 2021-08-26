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

/**
 * Drop fields which value is falsy from obj
 *
 * @param {object} obj
 * @param {array} fields
 * @returns {object}
 */
function omitFalsyFields(obj, fields) {
  const shallowCopy = Object.assign({}, obj);

  for (let i = 0; i < fields.length; i++) {
    const key = fields[i];
    if (shallowCopy.hasOwnProperty(key) && !shallowCopy[key]) {
      delete shallowCopy[key];
    }
  }

  return shallowCopy;
}

export {
  toDash,
  toCamel,
  getId,
  isUndef,
  isFunction,
  omitFalsyFields
};
