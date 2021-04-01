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
 * check whether attrs with extra key besides class/style/id/dataset
 * @param {object} attrs
 * @returns
 */
function hasExtraAttribute (attrs) {
  const res = Object.keys(attrs).find(prop => {
    return !(/class|style|id/.test(prop) || prop.startsWith('data-'))
  })
  return !!res;
}

export default {
  toDash,
  toCamel,
  getId,
  hasExtraAttribute
};
