export default function(currentData, setDataPath, cacheData) {
  // Reduce traversal through cacheData
  cacheData.find(({ cachedPath, value }) => {
    // Get data from cache data
    if (cachedPath === setDataPath) {
      setDataPath = '';
      currentData = value;
      return true;
    } else {
      const pathSplited = setDataPath.split(`${cachedPath}.`);
      // Current setDataPath is the subsequence of cached path
      if (pathSplited.length > 1) {
        setDataPath = pathSplited[1];
        currentData = value;
        return true;
      }
    }
    return false;
  });

  let latestValue = currentData;

  if (Object.prototype.toString.call(latestValue) !== '[object Object]' && !Array.isArray(latestValue)) {
    return latestValue;
  }
  const keys = setDataPath.split('.');
  if (keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      const matched = keys[i].match(/\[(.+?)\]/);
      const key = matched && matched[1] ? matched[1] : keys[i];
      // If i is not equal to keys length - 1, the parent node doesn't exist in the view
      if (!latestValue[key] && i !== keys.length - 1) {
        break;
      };
      latestValue = latestValue[key];
    }
  }

  return latestValue;
}
