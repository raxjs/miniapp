import EventTarget from '../../event/event-target';
import cache from '../../utils/cache';

export default function(eventName, evt, extra, nodeId) {
  const originNode = cache.getNode(nodeId);

  if (!originNode) return;
  EventTarget._process(
    originNode,
    eventName,
    evt,
    extra
  );
}
