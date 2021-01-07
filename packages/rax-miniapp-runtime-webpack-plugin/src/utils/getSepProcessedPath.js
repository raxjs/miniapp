module.exports = function(filePath) {
  return filePath.replace(/\\/g, '/'); // Avoid path error in Windows
};
