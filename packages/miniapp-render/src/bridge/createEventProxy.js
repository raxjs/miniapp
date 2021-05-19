// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';
import getDomNodeFromEvt from './events/getDomNodeFromEvt';
import baseEvents from './events/baseEvents';
import { handlesMap } from '../builtInComponents';
import callEvent from './events/callEvent';
import callSimpleEvent from './events/callSimpleEvent';
import callSingleEvent from './events/callSingleEvent';
import cache from '../utils/cache';

/**
 * Add event.currentTarget for canvas event
 * @param {Object} evt
 */
function adaptCanvasEvent(evt) {
  // currentTarget is missed in wechat canvas event
  if (!evt.currentTarget) {
    evt.currentTarget = { dataset: {}};
    evt.currentTarget.dataset.privateNodeId = evt.target.dataset.privateNodeId;
  }
}

export default function() {
  const config = {};
  // Add get DOM Node from event method
  config.getDomNodeFromEvt = getDomNodeFromEvt;
  // Add call event method
  config.callEvent = callEvent;
  // Add call simple event method
  config.callSimpleEvent = callSimpleEvent;
  // Add call single event method
  config.callSingleEvent = callSingleEvent;
  // Add reactive event define which will bubble
  baseEvents.forEach(({ name, extra = null, eventName }) => {
    config[name] = function(evt) {
      const domNode = this.getDomNodeFromEvt(evt);
      const document = domNode.ownerDocument;
      if (document && document.__checkEvent(evt)) {
        if (isMiniApp) {
          this.callEvent(eventName, evt, extra, evt.target.targetDataset.privateNodeId);
        } else {
          this.callEvent(eventName, evt, extra, evt.target.dataset.privateNodeId);
        }
      }
    };
  });
  // Add reactive event define which won't bubble
  handlesMap.simpleEvents.forEach(({ name, eventName }) => {
    config[name] = function(evt) {
      const nodeId = evt.currentTarget.dataset.privateNodeId;
      const targetNode = cache.getNode(nodeId);
      if (!targetNode) return;
      this.callSimpleEvent(eventName, evt, targetNode);
    };
  });

  // Add reactive event define which only trigger once
  handlesMap.singleEvents.forEach(({ name, eventName }) => {
    config[name] = function(evt) {
      if (isWeChatMiniProgram) {
        adaptCanvasEvent(evt);
      }
      this.callSingleEvent(eventName, evt);
    };
  });

  // Add reactive event define which only trigger once and need middleware
  handlesMap.functionalSingleEvents.forEach(({ name, eventName, middleware }) => {
    config[name] = function(evt) {
      const domNode = this.getDomNodeFromEvt(evt);
      if (!domNode) return;
      middleware.call(this, evt, domNode);
      this.callSingleEvent(eventName, evt);
    };
  });

  // Add reactive event define which complex
  handlesMap.complexEvents.forEach(({ name, eventName, middleware }) => {
    config[name] = function(evt) {
      const domNode = this.getDomNodeFromEvt(evt);
      if (!domNode) return;
      middleware.call(this, evt, domNode, evt.currentTarget.dataset.privateNodeId);
    };
  });
  return config;
}
