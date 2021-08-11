export default {
  name: 'switch',
  functionalSingleEvents: [
    {
      name: 'onSwitchChange',
      eventName: 'change',
      middleware(evt, domNode) {
        domNode._setAttributeWithDelayUpdate('checked', evt.detail.value);
      }
    }
  ]
};
