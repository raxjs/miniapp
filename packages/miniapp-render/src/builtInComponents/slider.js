export default {
  name: 'slider',
  singleEvents: [{
    name: 'onSliderChanging',
    eventName: 'changing'
  }],
  functionalSingleEvents: [
    {
      name: 'onSliderChange',
      eventName: 'change',
      middleware(evt, domNode) {
        domNode._setAttributeWithDelayUpdate('value', evt.detail.value);
        domNode.__oldValues = domNode.__oldValues || {};
        domNode.__oldValues.value = evt.detail.value;
      }
    }
  ]
};
