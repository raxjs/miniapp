// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

const picker = {
  name: 'picker',
  singleEvents: [{
    name: 'onPickerCancel',
    eventName: 'cancel'
  }],
  functionalSingleEvents: [
    {
      name: 'onPickerChange',
      eventName: 'change',
      middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('value', evt.detail.value);
      }
    }
  ]
};

if (!isMiniApp) {
  picker.singleEvents.push({
    name: 'onPickerColumnChange',
    eventName: 'columnchange'
  });
}

export default picker;
