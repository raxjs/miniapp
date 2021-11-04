const path = require('path');
const fs = require('fs-extra');
const { pathHelper: { getBundlePath } } = require('miniapp-builder-shared');

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
    // create page.ts
    fs.writeFileSync(filePath + '.ts', `
console.log('page');    
`);
    return require.resolve(`${filePath}.ts`);
  }
  return require.resolve(`${filePath}${ext}`);
}

function formatPath(pathStr) {
  return process.platform === 'win32' ? pathStr.split(path.sep).join('/') : pathStr;
}

export default setEntry;