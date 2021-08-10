import { CommandCore } from '@midwayjs/command-core';
import { loadSpec } from '@midwayjs/serverless-spec-builder';
import { PackagePlugin } from '@midwayjs/fcli-plugin-package';
import { WeChatPlugin } from '@midwayjs/fcli-plugin-wechat';

(async() => {
  const core = new CommandCore({
    config: {
      servicePath: process.env.baseDir,
    },
    options: {
      verbose: process.env.MIDWAY_FAAS_VERBOSE,
    },
    commands: ['package'],
    service: loadSpec(process.env.baseDir),
    provider: 'wechat',
    log: {
      ...console,
      log: (...args) => {
        if (process.env.MIDWAY_FAAS_VERBOSE) {
          console.log(...args);
        }
      },
    },
  });
  core.addPlugin(PackagePlugin);
  core.addPlugin(WeChatPlugin);
  await core.ready();
  await core.invoke(['package']);
})();
