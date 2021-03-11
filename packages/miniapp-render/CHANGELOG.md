# Changelog

## [2.1.0] - 2021-03-11

### Added
- Identify `catchTouchMove` to generate catch-view element
### Fixed
- Can't use canvas event in WeChat MiniProgram

### Changed
- Get `_internal` (native miniapp `this` instance) in element
- Set custom component events to page instance
## [2.0.4] - 2021-02-25

### Fixed

- Can't register onLongTap event
- Can't get default window object in cache
- Can't use requestAnimationFrame if window.requestAnimationFrame is assigned to new variables
