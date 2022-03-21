## Shared lib for miniapp builder

### separateNativeRoutes

Separate native miniapp pages, it will return native page list and rax page list.

### normalizeStaticConfig

Normalize static config to parse subpackages mode.

### getPluginConfig

It will return a valid plugin config for miniapp.

### pathHelper

It will export the following methods:
  - `relativeModuleResolve`
  - `normalizeOutputFilePath`
  - `getRelativePath`
  - `getDepPath`
  - `absoluteModuleResolve`
  - `getPlatformExtensions`
  - `isNativePage`
  - `removeExt`
  - `getHighestPriorityPackageJSON`
  - `getBundlePath`

### platformMap

It will return miniapp platform and suffix name correspondence.

### constants

It will return miniapp related constants

### autoInstallNpm

It will install npm for native miniapp automatically
