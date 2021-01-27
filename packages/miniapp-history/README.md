# MiniApp History
<a href="https://travis-ci.com/raxjs/miniapp-history"><img src="https://travis-ci.com/raxjs/miniapp-history.svg?branch=master"></a>
<img src="https://img.shields.io/npm/v/miniapp-history.svg" alt="npm package" />
<img src="https://img.shields.io/npm/dm/miniapp-history.svg" alt="npm downloads" />

## Install
```bash
$ npm install miniapp-history --save
```

## Usage

### Example1: normal case
```js
import { createMiniAppHistory } from 'miniapp-history';

const routes = [
  {
    'path': '/',
    'source': 'pages/Home/index'
  },
  {
    'path': '/page1',
    'source': 'pages/Page1/index',
  },
  {
    'path': '/page2',
    'source': 'pages/Page2/index'
  }
];

const history = createMiniAppHistory(routes);
```

### Example2: history.listen
```js
const unlisten = history.listen(({ location, action }) => {
  console.log(
    `The current URL is ${location.pathname}${location.search}${location.hash}`
  );
  console.log(`The last navigation action was ${action}`);
});

// ...

// Clean up
unlisten();
```

## API

### Support
* push(path)
* replace(path)
* back(delta)
* canGo()
* listen(callback)

### UnSupport
* go(callback)
* goForward()
