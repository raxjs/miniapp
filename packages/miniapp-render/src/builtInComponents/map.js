// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

export default {
  name: 'map',
  singleEvents: [{
    name: 'onMapTap',
    eventName: 'tap'
  },
  {
    name: 'onMapMarkerTap',
    eventName: 'markertap'
  },
  {
    name: 'onMapControlTap',
    eventName: 'controltap'
  },
  {
    name: 'onMapCalloutTap',
    eventName: 'callouttap'
  },
  {
    name: 'onMapUpdated',
    eventName: 'updated'
  },
  {
    name: 'onMapPoiTap',
    eventName: 'poitap'
  }],
  functionalSingleEvents: [
    {
      name: 'onMapRegionChange',
      eventName: 'regionchange',
      middleware(evt, domNode) {
        if (isMiniApp) {
          evt.detail = {
            type: evt.detail,
            latitude: evt.latitude,
            longitude: evt.longitude,
            scale: evt.scale,
            skew: evt.skew,
            rotate: evt.rotate,
            causedBy: evt.causedBy
          };
        } else {
          if (!evt.detail.causedBy) evt.detail.causedBy = evt.causedBy;
        }
      }
    }
  ]
};
