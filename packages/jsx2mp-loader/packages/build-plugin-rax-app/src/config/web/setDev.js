const path = require('path');

// Do not use `web/index.html` directly, for Windows, `path.join` will return a Windows-style paths.
const HTMLAssetPath = path.join('web', 'index.html');

module.exports = (config, context, index) => {
  config.devServer.set('before', (app, devServer) => {
    const compiler = devServer.compiler.compilers[index];
    const httpResponseQueue = [];
    let fallbackHTMLContent;

    compiler.hooks.emit.tap('AppHistoryFallback', function(compilation) {
      if (compilation.assets[HTMLAssetPath]) {
        fallbackHTMLContent = compilation.assets[HTMLAssetPath].source();
      } else {
        fallbackHTMLContent = 'Document Not Found.';
      }

      let res;
      // eslint-disable-next-line
      while (res = httpResponseQueue.shift()) {
        res.send(fallbackHTMLContent);
      }
    });

    app.get(/^\/?((?!\.(js|html|css|json)).)*$/, function(req, res) {
      if (fallbackHTMLContent !== undefined) {
        res.send(fallbackHTMLContent);
      } else {
        httpResponseQueue.push(res);
      }
    });
  });
};
