/**
 * Driver for Miniapp
 **/

function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    return cache[str] || (cache[str] = fn(str));
  };
}

// opacity -> opa
// fontWeight -> ntw
// lineHeight|lineClamp -> ne[ch]
// flex|flexGrow|flexPositive|flexShrink|flexNegative|boxFlex|boxFlexGroup|zIndex -> ex(?:s|g|n|p|$)
// order -> ^ord
// zoom -> zoo
// gridArea|gridRow|gridRowEnd|gridRowSpan|gridRowStart|gridColumn|gridColumnEnd|gridColumnSpan|gridColumnStart -> grid
// columnCount -> mnc
// tabSize -> bs
// orphans -> orp
// windows -> ows
// animationIterationCount -> onit
// borderImageOutset|borderImageSlice|borderImageWidth -> erim
const NON_DIMENSIONAL_REG = /opa|ntw|ne[ch]|ex(?:s|g|n|p|$)|^ord|zoo|grid|orp|ows|mnc|^columns$|bs|erim|onit/i;
const EVENT_PREFIX_REG = /^on[A-Z]/;
const CLASS_NAME = 'className';
const CLASS = 'class';
const STYLE = 'style';
const CHILDREN = 'children';

const TEXT_CONTENT_ATTR = 'textContent';

const CREATE_COMMENT = 'createComment';
const CREATE_TEXT_NODE = 'createTextNode';
const SET_ATTRIBUTE = 'setAttribute';
const REMOVE_ATTRIBUTE = 'removeAttribute';
const EMPTY = '';

const isDimensionalProp = cached(prop => !NON_DIMENSIONAL_REG.test(prop));
const isEventProp = cached(prop => EVENT_PREFIX_REG.test(prop));


function createBody(): HTMLElement {
  return document.body;
}

function createEmpty(): Comment {
  return document[CREATE_COMMENT](EMPTY);
}

function createText(text): Text {
  return document[CREATE_TEXT_NODE](text);
}

function updateText(node: any, text: string) {
  node[TEXT_CONTENT_ATTR] = text;
}

/**
* @param {string} type node type
* @param {object} props element properties
*/
function createElement(type: string, props: object) {
let style;
let attrs = {};
let events = [];

for (let prop in props) {
  const value = props[prop];
  if (prop === CHILDREN) continue;

  if (value !== null) {
    if (prop === STYLE) {
      style = value;
    } else if (isEventProp(prop)) {
      events.push({
        name: prop.slice(2).toLowerCase(),
        handler: value
      });
    } else {
      if (prop === 'className') {
        prop = 'class';
      }
      attrs[prop] = value;
    }
  }
}

// @ts-ignore
const node = document._createElement({
  tagName: type,
  document,
  attrs
});

if (style) {
  setStyle(node, style);
}

events.forEach(({ name, handler }) => {
  node.addEventListener(name, handler);
});

return node;
}

function appendChild(node: any, parent: any) {
  return parent.appendChild(node);
}

function removeChild(node: any, parent: any) {
  parent = parent || node.parentNode;
  // Maybe has been removed when remove child
  if (parent) {
    parent.removeChild(node);
  }
}

function replaceChild(newChild: any, oldChild: any, parent: any) {
  parent = parent || oldChild.parentNode;
  parent.replaceChild(newChild, oldChild);
}

function insertAfter(node: any, after: any, parent: any) {
  parent = parent || after.parentNode;
  const nextSibling = after.nextSibling;
  if (nextSibling) {
    // Performance improve when node has been existed before nextSibling
    if (nextSibling !== node) {
      insertBefore(node, nextSibling, parent);
    }
  } else {
    appendChild(node, parent);
  }
}

function insertBefore(node: any, before: any, parent: any) {
  parent = parent || before.parentNode;
  parent.insertBefore(node, before);
}

function addEventListener(node: any, eventName: string, eventHandler: any) {
  return node.addEventListener(eventName, eventHandler);
}

function removeEventListener(node: any, eventName: string, eventHandler: any) {
  return node.removeEventListener(eventName, eventHandler);
}

function removeAttribute(node: any, propKey: string) {
  if (propKey === CLASS_NAME) propKey = CLASS;

  if (propKey in node) {
    node[propKey] = null;
  }

  node[REMOVE_ATTRIBUTE](propKey);
}

function setAttribute(node: any, propKey: string, propValue) {
  if (propKey === CLASS_NAME) propKey = CLASS;

  if (propKey in node) {
    node[propKey] = propValue;
  } else {
    node[SET_ATTRIBUTE](propKey, propValue);
  }
}

/**
* @param {object} node target node
* @param {object} style target node style value
*/
function setStyle(node: any, style: object) {
  for (let prop in style) {
    const value = style[prop];
    let convertedValue;

    if (typeof value === 'number' && isDimensionalProp(prop)) {
      convertedValue = value + 'rpx';
    } else {
      convertedValue = value;
    }

    // Support CSS custom properties (variables) like { --main-color: "black" }
    if (prop[0] === '-' && prop[1] === '-') {
      // reference: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty.
      // style.setProperty do not support Camel-Case style properties.
      node.style.setProperty(prop, convertedValue);
    } else {
      node.style[prop] = convertedValue;
    }
  }
}

function beforeRender() {}

function afterRender() {}

/**
* Remove all children from node.
* @NOTE: Optimization at web.
*/
function removeChildren(node: any) {
  node.textContent = EMPTY;
}

export default {
  createBody,
  createEmpty,
  createText,
  updateText,
  createElement,
  appendChild,
  removeChild,
  replaceChild,
  insertAfter,
  insertBefore,
  addEventListener,
  removeEventListener,
  removeAttribute,
  setAttribute,
  setStyle,
  beforeRender,
  afterRender,
  removeChildren
}
