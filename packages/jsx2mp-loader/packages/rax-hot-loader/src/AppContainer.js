'use strict';

if (!module.hot || process.env.NODE_ENV === 'production') {
  module.exports = require('./AppContainer.prod');
} else {
  module.exports = require('./AppContainer.dev');
}
