## Shared lib for miniapp builder

### filterNativePages

It will filter native miniapp pages and return a need copy native page files list.

### getAppConfig

It will return a vaild app config for miniapp.

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
