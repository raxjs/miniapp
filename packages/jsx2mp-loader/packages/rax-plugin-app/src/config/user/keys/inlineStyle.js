const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (config, context, value, target) => {
  setCSSRule(config.module.rule('css').test(/\.css?$/), context, value, target);
  setCSSRule(config.module.rule('less').test(/\.less?$/), context, value, target);

  if (target === 'weex' || value) {
    config.module.rule('less')
      .use('less')
        .loader(require.resolve('less-loader'));
  } else if (target === 'web' && !value) {
    config.module.rule('less')
      .oneOf('raw')
        .use('less')
          .loader(require.resolve('less-loader'))
          .end()
        .end()
      .oneOf('normal')
        .use('less')
          .loader(require.resolve('less-loader'));

    config.plugin('minicss')
      .use(MiniCssExtractPlugin, [{
        filename: 'web/[name].css',
      }]);
  }
};

function setCSSRule(configRule, context, value, target) {
  const { userConfig } = context;
  const { extraStyle = {} } = userConfig;
  const { cssModules = {} } = extraStyle;
  const { modules , resourceQuery } = cssModules;

  // enbale inlineStyle
  if (target === 'weex' || value) {
    if (target === 'weex') {
      configRule
        .use('css')
          .loader(require.resolve('stylesheet-loader'))
          .options({
            transformDescendantCombinator: true,
          });
    }

    if (target === 'web') {
      configRule
        .use('css')
          .loader(require.resolve('stylesheet-loader'))
          .options({
            transformDescendantCombinator: true,
          })
          .end()
        .use('postcss')
          .loader(require.resolve('postcss-loader'))
          .options({
            ident: 'postcss',
            plugins: () => [
              require('postcss-plugin-rpx2vw')(),
            ],
          });
    }
    // disable inlineStyle
  } else if (target === 'web' && !value) {
    // extract css file in web while inlineStyle is disabled

    const postcssConfig = {
      ident: 'postcss',
      plugins: () => [
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
        }),
        require('postcss-plugin-rpx2vw')(),
      ],
    };


    configRule
      .use('minicss')
        .loader(MiniCssExtractPlugin.loader)
        .end()
      .oneOf('raw')
        .resourceQuery(resourceQuery ? new RegExp(resourceQuery) :/\?raw$/)
        .use('css')
          .loader(require.resolve('css-loader'))
          .end()
        .use('postcss')
          .loader(require.resolve('postcss-loader'))
          .options(postcssConfig)
          .end()
        .end()
      .oneOf('normal')
        .use('css')
          .loader(require.resolve('css-loader'))
          // reference: https://github.com/webpack-contrib/css-loader/tree/v2.1.1#localidentname
            .options(
              modules ? {
                importLoaders: 2,
                modules: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              } : {})
            .end()
        .use('postcss')
          .loader(require.resolve('postcss-loader'))
          .options(postcssConfig);
  }
}
