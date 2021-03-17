export default {
  name: 'web-view',
  singleEvents: [{
    name: 'onWebViewMessage',
    eventName: 'message'
  },
  {
    name: 'onWebViewLoad',
    eventName: 'load'
  },
  {
    name: 'onWebViewError',
    eventName: 'error'
  }]
};
