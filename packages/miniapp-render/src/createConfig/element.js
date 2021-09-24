// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import createEventProxy from '../bridge/createEventProxy';
import cache from '../utils/cache';
import { getComponentLifeCycle } from '../bridge/lifeCycleAdapter';
import { COMPONENT_WRAPPER } from '../constants';

export default function() {
  if (isMiniApp) {
    return {
      props: {
        r: {}
      },
      methods: createEventProxy(),
      ...getComponentLifeCycle({
        mount() {
          cache.setElementInstance(this);
          const node = cache.getNode(this.props.r.nodeId);
          if (node) {
            node._internal = this;
            node.__isCustomComponentRoot = true; // add __isCustomComponentRoot tag to mark the custom component when getting native component instance
          }
        },
        onInit() {
          if (this.props.__tag === COMPONENT_WRAPPER) {
            this.data = this.props; // init set data
          }
        }
      })
    };
  } else {
    return {
      properties: {
        r: {
          type: Object,
          value: {}
        }
      },
      options: {
        styleIsolation: 'shared',
        virtualHost: true
      },
      methods: createEventProxy(),
      ...getComponentLifeCycle({
        mount() {
          cache.setElementInstance(this);
          const node = cache.getNode(this.properties.r.nodeId);
          node._internal = this;
          node.__isCustomComponentRoot = true; // add __isCustomComponentRoot tag to mark the custom component when getting native component instance
        }
      })
    };
  }
}
