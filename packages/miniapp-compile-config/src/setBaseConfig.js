const webpack = require('webpack');

const ComponentLoader = require.resolve('jsx2mp-loader/src/component-loader');
const ScriptLoader = require.resolve('jsx2mp-loader/src/script-loader');
const FileLoader = require.resolve('jsx2mp-loader/src/file-loader');
const {
  platformMap,
  pathHelper: { getPlatformExtensions },
} = require('miniapp-builder-shared');

const CopyJsx2mpRuntimePlugin = require('./plugins/CopyJsx2mpRuntime');
const CopyPublicFilePlugin = require('./plugins/CopyPublicFile');
const RemoveDefaultPlugin = require('./plugins/RemoveDefaultResult');
const AutoInstallNpmPlugin = require('./plugins/AutoInstallNpm');

module.exports = (
  chainConfig,
  userConfig,
  { context, entryPath, outputPath, loaderParams, target, originalConstantDir = [] }
) => {
  const platformInfo = platformMap[target];
  const { rootDir, command } = context;
  const {
    platform = platformInfo.type,
    virtualHost = false,
    nativePackage = {}
  } = userConfig;

  const mode = command;

  // Remove useless alias
  ['babel-runtime-jsx-plus', '@babel/runtime', 'rax-app', 'rax-app$', 'rax'].forEach(packageName => {
    chainConfig.resolve.alias.delete(packageName);
  });

  // Add React alias
  chainConfig.resolve.alias.set('react', 'rax');

  const aliasEntries = chainConfig.resolve.alias.entries();
  loaderParams.aliasEntries = aliasEntries;

  // Clear prev rules
  ['jsx', 'tsx'].forEach(name => {
    chainConfig.module.rule(name).uses.clear();
  });

  ['css', 'less', 'scss'].forEach(name => {
    chainConfig.module.rule(name).uses.clear();
    chainConfig.module.rule(`${name}-module`).uses.clear();
    chainConfig.module.rule(`${name}-global`).uses.clear();
  });

  // In compile mode, resolve.mainFields must be main
  chainConfig.resolve.mainFields.add('main').add('module');

  if (/^4\./.test(webpack.version)) {
    // Clear conditionNames
    chainConfig.plugins.delete('ExportsFieldWebpackPlugin');
  } else {
    // Clear conditionNames
    chainConfig.resolve.delete('conditionNames');
    // If there is no conditionNames field, it will use `exports` field default value
    // Redirect export field, https://webpack.js.org/configuration/resolve/#resolveexportsfields
    chainConfig.resolve.merge({
      exportsFields: ['miniapp_compile-exports'],
    });
  }


  // Compile ts file
  chainConfig.module
    .rule('tsx')
    .test(/\.(tsx?)$/)
    .use('ts')
    .loader(require.resolve('ts-loader'))
    .options({
      transpileOnly: true,
    });

  // Remove all app.json before it
  chainConfig.module.rule('appJSON').uses.clear();

  chainConfig
    .cache(true)
    .target('node');

  chainConfig.module
    .rule('withRoleJSX')
    .test(/\.t|jsx?$/)
    .enforce('post')
    .exclude.add(/node_modules/)
    .end()
    .use('component')
    .loader(ComponentLoader)
    .options({
      ...loaderParams,
      entryPath,
      virtualHost,
      rootDir
    })
    .end()
    .use('platform')
    .loader(require.resolve('rax-platform-loader'))
    .options({ platform: target })
    .end()
    .use('script')
    .loader(ScriptLoader)
    .options({
      ...loaderParams,
      rootDir
    })
    .end();

  chainConfig.module
    .rule('npm')
    .test(/\.js$/)
    .include.add(/node_modules/)
    .end()
    .use('script')
    .loader(ScriptLoader)
    .options({
      ...loaderParams,
      rootDir
    })
    .end();

  chainConfig.module
    .rule('staticFile')
    .test(/\.(bmp|webp|svg|png|webp|jpe?g|gif)$/i)
    .use('file')
    .loader(FileLoader)
    .options({
      entryPath,
      outputPath,
    });

  // Exclude app.json
  chainConfig.module
    .rule('json')
    .test(/\.json$/)
    .use('script-loader')
    .loader(ScriptLoader)
    .options({
      ...loaderParams,
      rootDir
    })
    .end()
    .use('json-loader')
    .loader(require.resolve('json-loader'));

  // Distinguish end construction
  chainConfig.resolve.extensions
    .clear()
    .merge(
      getPlatformExtensions(platform, ['.js', '.jsx', '.ts', '.tsx', '.json'])
    );

  chainConfig.externals(
    [
      function(...args) {
        let request;
        let callback;

        if (args[0].request) {
          // webpack5
          request = args[0].request;
          callback = args[1];
        } else {
          // webpack4
          [, request, callback] = args;
        }
        if (/^rax-app/.test(request)) {
          return callback(null, `commonjs ${request}`);
        }
        if (/\.(c|le|sc)ss$/.test(request)) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      },
    ].concat(chainConfig.get('externals') || [])
  );

  if (originalConstantDir.length > 0) {
    chainConfig.plugin('copyPublicFile').use(CopyPublicFilePlugin, [
      {
        mode,
        outputPath,
        rootDir,
        constantDir: originalConstantDir,
        target,
      },
    ]);
  }

  if (!loaderParams.disableCopyNpm) {
    chainConfig
      .plugin('runtime')
      .use(CopyJsx2mpRuntimePlugin, [{ platform, mode, outputPath, rootDir }]);
  }

  // Remove webpack default generate assets
  chainConfig
    .plugin('RemoveDefaultPlugin')
    .use(RemoveDefaultPlugin);

  // Auto install npm for native miniapp
  chainConfig
    .plugin('AutoInstallNpmPlugin')
    .use(AutoInstallNpmPlugin, [{ nativePackage }]);
};
