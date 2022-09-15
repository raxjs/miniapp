# Changelog
## [0.4.37]

- Fix(bytedance-microapp): componentTag don't support the name start with '_'. Remove the `_` in bytedance.


## [0.4.36]

- Support `tagNameMap` in `miniappConfig.subPackages`
- Make `rax-swiper` compatible with wechat

## [0.4.35] - 2021-08-27

- Return renamed index in list

## [0.4.34] - 2021-08-24

- Compatible with old version of jsx2mp-runtime, which not support list key

## [0.4.33] - 2021-08-19

- Support key in list (x-for, map)

## [0.4.32] - 2021-06-30

### Fixed

- Miss basedir config in resolve

## [0.4.31] - 2021-06-29

### Changed

- Use resolve to replace `require.resolve` to make exports field compatible

## [0.4.30] - 2021-03-30

### Added

- Support compiling virtualHost config into code

## [0.4.29] - 2021-03-04

### Fixed

- Can't judge variables derived from props correctly
- Not judge variables whether derived from props in wechat
- Can't delete css files in app.js in subPackages mode
- Chinese characters are escaped by mistake
- Compiling will crash if module column has package.json
