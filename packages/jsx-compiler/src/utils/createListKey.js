const t = require('@babel/types');

let listKeyCount = 0;

// Create increasing index node
module.exports = function() {
  return t.identifier('_key' + listKeyCount++);
};
