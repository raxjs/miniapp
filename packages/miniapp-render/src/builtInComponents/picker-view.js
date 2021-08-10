export default {
  name: 'picker-view',
  singleEvents: [{
    name: 'onPickerViewPickstart',
    eventName: 'pickstart'
  },
  {
    name: 'onPickerViewPickend',
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
