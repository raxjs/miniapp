jest.mock('universal-env', () => {
  return {
    isMiniApp: true,
    isNode: false,
    isWeChatMiniProgram: false,
    isWeb: false,
    isWeex: false
  };
});

let status = '';


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

let currentPages = [{
  route: 'pages/Home/index'
}];

describe('history', () => {
  beforeAll(() => {
    global.my = {
      navigateTo: ({ url, success }) => {
        status = 'navigateTo:' + url;
        currentPages.push({
          route: url
        });
        success();
      },
      redirectTo: ({ url, success }) => {
        status = 'redirectTo:' + url;
        currentPages[currentPages.length - 1] = {
          route: url
        };
        success();
      },
      navigateBack: () => {
        status = 'navigateBack';
        currentPages.splice(currentPages.length - 1, 1);
      }
    };

    global.getCurrentPages = () => {
      return currentPages;
    };
  });

  afterEach(() => {
    currentPages = [{
      route: 'pages/Home/index'
    }];
  });

  it('push: /page1', async() => {
    await import('..').then(({ createMiniAppHistory }) => {
      const history = createMiniAppHistory(routes);
      history.push('/page1');
    });
    expect(status).toEqual('navigateTo:/pages/Page1/index');
  });

  it('replace: /page1', async() => {
    await import('..').then(({ createMiniAppHistory }) => {
      const history = createMiniAppHistory(routes);
      history.replace('/page1');
    });
    expect(status).toEqual('redirectTo:/pages/Page1/index');
  });

  it('back: /page1', async() => {
    await import('..').then(({ createMiniAppHistory }) => {
      const history = createMiniAppHistory(routes);
      history.back();
    });
    expect(status).toEqual('navigateBack');
  });

  it('listen push: /page1', async() => {
    let result = {};
    await import('..').then(({ createMiniAppHistory }) => {
      const history = createMiniAppHistory(routes);
      history.listen(({ location, action }) => {
        result.location = location;
        result.action = action;
      });
      history.push('/page1');
    });
    expect(status).toEqual('navigateTo:/pages/Page1/index');
    expect(result.location.pathname).toEqual('/pages/Page1/index');
    expect(result.action).toEqual('PUSH');
  });

  it('listen replace: /page2', async() => {
    let result = {};
    await import('..').then(({ createMiniAppHistory }) => {
      const history = createMiniAppHistory(routes);
      history.listen(({ location, action }) => {
        result.location = location;
        result.action = action;
      });
      history.replace('/page2');
    });
    expect(status).toEqual('redirectTo:/pages/Page2/index');
    expect(result.location.pathname).toEqual('/pages/Page2/index');
    expect(result.action).toEqual('REPLACE');
  });

  it('listen goBack', async() => {
    let result = {};
    await import('..').then(({ createMiniAppHistory }) => {
      const history = createMiniAppHistory(routes);
      history.push('/page2');
      history.listen(({ location, action }) => {
        if (action === 'POP') {
          result.location = location;
          result.action = action;
        }
      });
      history.back();
    });
    expect(status).toEqual('navigateBack');
    expect(result.location.pathname).toEqual('/pages/Home/index');
    expect(result.action).toEqual('POP');
  });

  it('unlisten push: /page1', async() => {
    let result = {};
    await import('..').then(({ createMiniAppHistory }) => {
      const history = createMiniAppHistory(routes);
      const unlisten = history.listen(({ location, action }) => {
        result.pathname = location.pathname;
        result.action = action;
      });
      history.push('/page1');
      unlisten();
      history.push('/page2');
    });
    expect(status).toEqual('navigateTo:/pages/Page2/index');
    expect(result.pathname).toEqual('/pages/Page1/index');
    expect(result.action).toEqual('PUSH');
  });
});

describe('location', () => {
  beforeAll(() => {
    global.my = {
      navigateTo: ({ url }) => {
        status = 'navigateTo:' + url;
      },
      redirectTo: ({ url }) => {
        status = 'redirectTo:' + url;
      },
      navigateBack: () => {
        status = 'navigateBack';
      }
    };

    global.getCurrentPages = () => {
      return currentPages;
    };
  });

  it('pathname', async() => {
    let history;
    await import('..').then(({ createMiniAppHistory }) => {
      history = createMiniAppHistory(routes);
    });
    expect(history.location.pathname).toEqual('/pages/Home/index');
  });
});

