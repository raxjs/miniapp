# Changelog

## [2.6.1] - 2021-06-09

### Fixed

- Add missed component events in bytedance/baidu/kuaishou

## [2.6.0] - 2021-06-02

### Added

- Support `setDataFinished` event in window after setData finished
- Support passing `WebkitLineClamp` in style

## [2.5.0] - 2021-05-19

### Added

- Support bytedance microapp/baidu smartprogram/kuaishou miniprogram

### Fixed

- Can't get correct target of basic events in global event

## [2.4.0] - 2021-05-13

### Added

- Support config `anchorScroll` in scroll-view in wechat to use custom scroll-view template without scroll-top or scroll-left

### Fixed

- Global document is not switched when reLaunch api is invoked in unload lifecycle

## [2.3.4] - 2021-05-10

### Added

- Support camera component in ali miniapp

## [2.3.3] - 2021-04-25

### Changed

- Remove unnecessary setData caused by setAttribute in un-rendered element
- Remove unnecessary setData caused by get classList action

### Fixed

- Miss some events in textarea component
- Remove miniapp components default style like button

## [2.3.2] - 2021-04-22

### Fixed

- Can't get correct window in subpackages mode

## [2.3.1] - 2021-04-12

### Fixed

- `_processNodeType` error in normal components

### Changed

- Remove text from touch components

## [2.3.0] - 2021-04-08

### Added

- Grade view/text/image/h-element into static/pure/no-touch/no-appear/no-appear-touch level

### Changed

- Add dispatch document modify callback
- Remove some unnecessary element destory logic in page unload lifecycle
- Remove some useless code


## [2.2.3] - 2021-03-31

### Changed

- Share window when share memory in subpackages

## [2.2.2] - 2021-03-30

### Fixed

- Miss app instance in native app licecycle methods

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
