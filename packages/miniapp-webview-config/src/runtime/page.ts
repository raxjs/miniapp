function parseParams(query) {
  const paramString =  encodeURIComponent(Object.keys(query).map(key => {
    return `${key}=\${query[key]}`;
  }).join('&'));
  return paramString ?`?${paramString}` : '';
}

export function createWebviewPage({
  page = {},
  webview = {}
}: {
  page: {
    onLoad?: (query: Object) => void;
  },
  webview: {
    onMessage?: (e: { detail: any }) => void;
  }
}) {
  const { onLoad, ...rest } = page;
  // const webviewMethods = {};
  // todo
  return function (url) {
    return {
      data: {
        url,
        params: ''
      },
      onLoad: function(query) {
        this.setData({
          params: parseParams(query)
        });
        onLoad && onLoad(query);
      },
      ...rest,
    }
  }
}
