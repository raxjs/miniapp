const fs = require('fs-extra');
const jsx2mp = require('jsx2mp-cli');

const getOutputPath = require('./getOutputPath');

module.exports = (context) => {
  const outputPath = getOutputPath(context);
  fs.removeSync(outputPath);

  return new Promise((resolve) => {
    jsx2mp.build({
      webpackConfig: {
        output: {
          path: outputPath,
        },
      },
      afterCompiled: (err, stats) => {
        resolve({
          err,
          stats,
        });
      },
    });
  });
};
