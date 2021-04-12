module.exports = function rmCurDirPathSymbol(filePath) {
  return filePath.indexOf('./') === 0 ? filePath.slice(2) : filePath;
};
