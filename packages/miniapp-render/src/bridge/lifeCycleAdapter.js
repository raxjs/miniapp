// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

export function getComponentLifeCycle({ mount, unmount, update }) {
  if (isMiniApp) {
    return {
      didMount(...args) {
        mount && mount.apply(this, args);
      },
      didUpdate(...args) {
        update && update.apply(this, args);
      },
      didUnmount(...args) {
        unmount && unmount.apply(this, args);
      }
    };
  } else {
    return {
      attached(...args) {
        mount && mount.apply(this, args);
      },
      detached(...args) {
        unmount && unmount.apply(this, args);
      }
    };
  }
}
