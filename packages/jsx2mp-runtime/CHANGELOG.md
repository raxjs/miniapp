# Changelog

## [0.4.25] - 2021-10-21

### Fixed

- Bind native events on page instance other than page component

## [0.4.24] - 2021-09-26

### Changed

- Set modern mode default value to true to satisfy plugin project

### Fixed

- forceUpdate can't work if shouldComponent is configured
- useReducer can't rerender component if memo exists

## [0.4.23] - 2021-08-19

- Support list key


## [0.4.22] - 2021-07-6

### Fixed

- Can't share successfully when user doesn't config app.onShareAppMessage

### Added

- Support pass variables in runApp to app instance

## [0.4.21] - 2021-03-30

### Added

- Support merging virtualHost config into component config

### Fixed

- Render props can't work in wechat miniprogram
