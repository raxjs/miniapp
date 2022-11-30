# Changelog

## [5.0.5] - 2022-11-30

### Added

- Support `page-container` native component in wechat-miniprogram

## [5.0.4] - 2022-08-30

### Fixed

- *.css.map will be handled as css files if sourceMap is set to 'source-map'

## [5.0.3] - 2022-03-02

### Added

- Add `polyfillFunction` config to polyfill Function

## [5.0.2] - 2022-05-17

### Fixed

- Add default value for setting in map component

## [5.0.1] - 2022-01-11

### Added

- Support lottie events
- Support type props in canvas
- Support enableNative props in video component

### Changed

- Remove colors dependency

## [5.0.0] - 2021-12-14

### Added

- Support webpack5

### Changed

- Only wrapper `document`/`window` mock func in necessary file

## [4.11.2] - 2021-11-01

### Fixed

- Can't use canvas ready event

## [4.11.1] - 2021-09-26

### Added

- Support ad component

### Changed

- Use longpress to replace longtap in wechat/baidu/bytedance/kuaishou

## [4.11.0] - 2021-09-09

### Added

- Support deleting components in template

## [4.10.0] - 2021-08-31

### Added

- Support flex display for view and h-element in baidu and kuaishou miniapp

### Fixed

- Can't use longtap event

## [4.9.0] - 2021-08-05

### Added

- Support generating multiple package.json file in subpackages mode

### Fixed

- Data binding error in scroll-view template in baidu smartprogram
- Text can't be nested in baidu smartprogram
- Can't generate native components template in windows system

## [4.8.0] - 2021-07-20

### Added

- Support configuring miniapp plugin project
- Replace :root to page in bytedance/baidu/kuaishou miniapp

### Fixed

- Template generation error

## [4.7.0] - 2021-07-13

### Changed

- Pass app instance to js bundle in cases that getApp() can't get app instance

## [4.6.1] - 2021-06-09

### Fixed

- template error in bytedance microapp

## [4.6.0] - 2021-06-02

- Support miniapps that don't support sjs

- Identify bytedance microapp as miniapp platform that doesn't support sjs

- Support configuring adding props of component template in `build.json`

## [4.5.0] - 2021-05-19

- Support bytedance microapp/baidu smartprogram/kuaishou miniprogram

## [4.4.0] - 2021-05-13

### Added

- Support config `anchorScroll` in scroll-view in wechat to use custom scroll-view template without scroll-top or scroll-left
- Support use cover-view in map

### Fixed

- Can't use native components of main package in subpackages

## [4.3.4] - 2021-05-10

### Added

- Support camera component in ali miniapp

## [4.3.3] - 2021-04-30

### Fixed

- Remove default styles of button, progress and label

## [4.3.2] - 2021-04-22

### Fixed

- Can't use rax miniapp compile components in subpackages mode

### Changed

- Remove some components that miniapp and web both have in webTagList

## [4.3.1] - 2021-04-12

### Fixed

- Remove touch events in text component

## [4.3.0] - 2021-04-08

### Added

- Add static/pure/no-touch/no-appear/no-appear-touch components template

### Fixed

- Miss props in wechat picker template
- Miss native component npm in subpackages mode

## [4.2.1] - 2021-03-31

### Changed

- Add modify `document` callback front of wrapper chunk

## [4.2.1] - 2021-03-31

### Changed

- Not require `webpack-runtime.js` in page js file

## [4.2.0] - 2021-03-30

### Added

- Support config native miniapp dependencies in build.json

### Fixed

- Native component template generation in ali miniapp
- Miss `onGetAuthorize` and `onError` events in ali miniapp button template
- Miss `animation` props in wechat miniapp view template


## [4.1.1] - 2021-03-25

### Added

- Add `data-params` in ali miniapp button template
## [4.1.0] - 2021-03-23

### Added
- Support using plugin ans native components in sub packages
- Support import native app config
- Add `disable-scroll` in ali miniapp view template
- Add contact-button  in ali miniapp
- Add `data-params` in wechat miniprogram button template
## [4.0.2] - 2021-03-15

### Fixed

- Miss click event in image component
- Check whether events exist in miniapp native components before deleting
- Set animation default value to `null` in h-element

## [4.0.1] - 2021-03-12

### Fixed

- Can't use nested scroll-view in wechat
- Generate wrong usingComponents for npm native components in page json

## [4.0.0] - 2021-03-11

### Changed

- Refact the template generation
