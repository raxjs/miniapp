import { transformSync } from '@builder/swc';
import * as csso from 'csso';
import { pd as prettyData } from 'pretty-data';
import { platformMap } from 'miniapp-builder-shared';

export function minifyJS(source) {
  return transformSync(source, {
    jsc: {
      minify: Object.assign({
        compress: {
          unused: false,
        },
        mangle: true,
      }),
      target: 'es2021',
    },
    minify: true,
  }).code;
}

export function minifyCSS(source) {
  return csso.minify(source, {
    restructure: false
  }).css;
}

export function minifyXML(source) {
  return prettyData.xmlmin(source);
}

export function minifyJSON(source) {
  return prettyData.json(source);
}

export function minify(source, type = '.js', target) {
  if (type === '.js') {
    return minifyJS(source);
  }
  if (type === '.css' || type === platformMap[target].extension.css) {
    return minifyCSS(source);
  }
  if (type === '.json') {
    return minifyJSON(source);
  }
  if (/\..*ml/.test(type)) {
    return minifyXML(source);
  }

  return source;
}