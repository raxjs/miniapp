const fs = require('fs-extra');
const BJSON = require('buffer-json');
const path = require('path');
const mkdirp = require('mkdirp');
const crypto = require('crypto');

const saveCache = (content, { filePath, cacheDirectory }) => {
  const stats = fs.statSync(filePath);
  const mtime = stats.mtime.getTime();
  const cacheKey = cacheKeyFn({
    cacheDirectory,
    filePath,
    mtime,
  });

  write(cacheKey, content);
};

const getCache = ({ filePath, cacheDirectory }) => {
  if (!fs.pathExistsSync(cacheDirectory)) return null;

  const stats = fs.statSync(filePath);
  const mtime = stats.mtime.getTime();

  const cacheKey = cacheKeyFn({
    cacheDirectory,
    filePath,
    mtime,
  });

  return read(cacheKey);
};

const getCacheDirName = ({ config, mode }) => {
  return `${typeof config === 'object' && config.cacheDirectory || '.miniCache'}/${mode}`;
};

const directories = new Set();

function write(key, data, callback) {
  const dirname = path.dirname(key);
  const content = BJSON.stringify(data);

  if (directories.has(dirname)) {
    // for performance skip creating directory
    fs.writeFile(key, content, 'utf-8', callback);
  } else {
    mkdirp(dirname)
      .catch((mkdirErr) => {
        callback(mkdirErr);
      })
      .then(() => {
        directories.add(dirname);
        fs.writeFile(key, content, 'utf-8', callback);
      });
  }
}

function read(key) {
  try {
    const content = fs.readFileSync(key, 'utf-8');
    const data = BJSON.parse(content);
    return data;
  } catch {
    return null;
  }
}

function cacheKeyFn(options) {
  const { cacheDirectory, filePath, mtime } = options;
  const hash = digest(`${filePath}\n${mtime}`);

  return path.join(cacheDirectory, `${hash}.json`);
}

function digest(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function compare(stats, dep) {
  return stats.mtime.getTime() === dep.mtime;
}

module.exports = {
  saveCache,
  getCache,
  getCacheDirName
};
