const addFileToCompilation = require('../utils/addFileToCompilation');

function generateAppJS(
  compilation,
  {
    target,
    command
  }
) {
  const content = 'App({})';
  addFileToCompilation(compilation, {
    filename: 'app.js',
    content,
    target,
    command
  });
}

module.exports = {
  generateAppJS
};
