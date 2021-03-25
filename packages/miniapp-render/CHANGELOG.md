# Changelog

## [2.2.1] - 2021-03-25

### Fixed
- Can't identify contact-button as builtin components
- Avoid `requireModule` effect building in ali miniapp
- Update dataset didn't trigger update
## [2.2.0] - 2021-03-23

### Added

- Support inject native app licecycle methods
- Add contact-button
- Add `requireModule` method in app to support share memory in subpackages

### Fixed
- Miss official-account component import

## [2.1.1] - 2021-03-15

### Fixed

- Rename web-view related events

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
