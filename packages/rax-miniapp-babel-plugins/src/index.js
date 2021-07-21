module.exports = function({ usingComponents, nativeLifeCycleMap, target, rootDir, usingPlugins, runtimeDependencies, isPluginProject }) {
  return [
    require.resolve('./plugins/babel-plugin-remove-Function'),
    require.resolve('./plugins/babel-plugin-external-module'),
    [
      require.resolve('./plugins/babel-plugin-native-lifecycle'),
      {
        nativeLifeCycleMap,
        isPluginProject
      },
    ],
    [
      require.resolve('./plugins/babel-plugin-handle-native-component'),
      {
        usingComponents,
        target,
        rootDir,
        runtimeDependencies
      }
    ],
    [
      require.resolve('./plugins/babel-plugin-handle-plugin-component'),
      {
        usingPlugins
      }
    ],

  ];
};
