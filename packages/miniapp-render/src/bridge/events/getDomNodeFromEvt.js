import cache from '../../utils/cache';

export default function(evt) {
  if (!evt) return;
  const target = evt.currentTarget;
  return cache.getNode(target && target.dataset.privateNodeId);
}
