# Changelog

## [0.4.37] UnRelease

- Feat: support remove unused import and require of App、Page、Component、Npm package
- Feat: miniappConfig compat the case where the entry of component use multiple platform like index.wechat.js, index.ali.js. And don't change the filed main that can't be resolved
- Feat: hackRegeneratorRuntimeFunction in ali miniapp of copyNpm
- Fix: support platform-loader
- Fix: script-loader exclude 'plugin://xx/comp' in usingComponents

## [0.4.36] - 2022-06-22

### Fixed

- just replace 'rem' in css value of specific pattern, to prevent break css name or css key
- - Fix RegExp of function removeExt. Just replace file that like 'index.ali.js', excludes 'ali.js', that's bug in v0.4.35


## [0.4.35] - 2022-02-10

### Fixed

- component of pure js support shaking by filename postfix

## [0.4.34] - 2022-01-06

### Fixed

- update the logic of replacing rem to rpx

## [0.4.33] - 2021-12-14

### Changed

- update miniapp-builder-shared to v3.0.0

## [0.4.32] - 2021-11-03

### Fixed

- Can't find app_css custom component when the file and app_css are in the same directory

## [0.4.31] - 2021-11-01

### Changed

- Use @babel/preset-env for js/ts files in dev mode

## [0.4.30] - 2021-08-31

### Fixed

- Error can't be catch in eliminateDeadCode

## [0.4.29] - 2021-07-12

### Fixed

- Use file resourcePath as basedir

## [0.4.28] - 2021-06-30

### Fixed

- Miss basedir config in resolve

## [0.4.27] - 2021-06-29

### Changed

- Use resolve to replace `require.resolve` to make exports field compatible

## [0.4.25] - 2021-05-19

### Chore

- Use constants in miniapp-builder-shared

## [0.4.25] - 2021-03-30

### Added

- Support passing virtualHost config into jsx-compiler
## [0.4.24] - 2021-03-11

### Chore

- Update less and stylesheet-loader version

## [0.4.23] - 2021-03-08

### Fixed

- Miss custom component json file in copyNpm mode

