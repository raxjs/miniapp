import * as path from 'path';
import * as fs from 'fs-extra';
import  { pathHelper } from 'miniapp-builder-shared';

const { getBundlePath } = pathHelper;

function setEntry(config, { rootDir, appConfig }) {
  appConfig.routes.forEach(({entryName}) => {
    const dirname = path.dirname(entryName);
    const pageEntry = moduleResolve(formatPath(path.join(rootDir, 'src', dirname, 'page')));
    config
      .entry(getBundlePath(dirname))
      .add(pageEntry);
  });
};

function moduleResolve(filePath) {
  const ext = ['.ts', '.js'].find((extension) => fs.existsSync(`${filePath}${extension}`));
  if (!ext) {
    fs.writeFileSync(filePath + '.ts', `
import { createWebviewPage } from 'rax-app';
export default createWebviewPage({});
`);
    return require.resolve(`${filePath}.ts`);
  }
  return require.resolve(`${filePath}${ext}`);
}

function formatPath(pathStr) {
  return process.platform === 'win32' ? pathStr.split(path.sep).join('/') : pathStr;
}

export default setEntry;