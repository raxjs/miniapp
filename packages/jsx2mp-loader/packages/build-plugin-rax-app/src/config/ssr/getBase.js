const getWebpackBase = require('../getWebpackBase');
const setUserConfig = require('../user/setConfig');

module.exports = (context) => {
  const { userConfig } = context;
  const config = getWebpackBase(context, {
    isSSR: true,
  });

  config.target('node');

  config.output
    .libraryTarget('commonjs2');

  ['jsx', 'tsx'].forEach(tag => {
    config.module.rule(tag)
      .use('platform')
      .options({
        platform: 'node',
      });
  });

  // Map user config in build.json to webpack config.
  // In the normal entry task, `registerUserConfig` is provide by `scripts-core`.
  // But here we get webpack config for SSR to render `Document` in sub webpack compiler.
  // To avoid pass `registerUserConfig` layer by layer, here we reimplement the `registerUserConfig`
  setUserConfig({
    registerUserConfig: (registers) => {
      // Each registers define how keys in build.json be mapped to webpack config, they are defined in `../user/keys`
      registers.forEach((register) => {
        if (register.configWebpack) {
          const value = userConfig[register.name] || register.defaultValue;
          register.configWebpack(config, value, {
            ...context,
            taskName: 'node',
          });
        }
      });
    },
  });

  return config;
};
