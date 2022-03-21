export default {
  name: 'picker-view',
  singleEvents: [{
    name: 'onPickerViewPickStart',
    eventName: 'pickstart'
  },
  {
    name: 'onPickerViewPickEnd',
    eventName: 'pickend'
  }],
  functionalSingleEvents: [
    {
      name: 'onPickerViewChange',
      eventName: 'change',
      middleware(evt, domNode) {
        domNode._setAttributeWithDelayUpdate('value', evt.detail.value);
      }
    }
  ]
};
