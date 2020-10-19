// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

export default {
  name: 'map',
  singleEvents: [{
    name: 'onMapTap',
    eventName: 'tap'
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
    },
    {
      name: 'onMapMarkerTap',
      eventName: 'markertap',
      middleware(evt, domNode) {
        if (isMiniApp) {
          evt.detail = {
            markerId: evt.markerId,
            latitude: evt.latitude,
            longitude: evt.longitude
          };
        }
      }
    },
    {
      name: 'onMapControlTap',
      eventName: 'controltap',
      middleware(evt, domNode) {
        if (isMiniApp) {
          evt.detail = {
            controlId: evt.controlId
          };
        }
      }
    },
    {
      name: 'onMapCalloutTap',
      eventName: 'callouttap',
      middleware(evt, domNode) {
        if (isMiniApp) {
          evt.detail = {
            markerId: evt.markerId,
            latitude: evt.latitude,
            longitude: evt.longitude
          }
        }
      }
    },
    {
      name: 'onMapPanelTap',
      eventName: 'paneltap',
      middleware(evt, domNode) {
        if (isMiniApp) {
          evt.detail = {
            panelId: evt.panelId,
            layoutId: evt.layoutId
          };
        }
      }
    },
  ]
};
