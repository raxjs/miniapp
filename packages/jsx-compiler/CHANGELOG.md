# Changelog

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
