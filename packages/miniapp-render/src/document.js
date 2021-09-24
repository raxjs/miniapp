import EventTarget from './event/event-target';
import Node from './node/node';
import Element from './node/element';
import TextNode from './node/text-node';
import Comment from './node/comment';
import cache from './utils/cache';
import Image from './node/element/image';
import Input from './node/element/input';
import Textarea from './node/element/textarea';
import Video from './node/element/video';
import CustomComponent from './node/element/custom-component';
import RootElement from './node/root';
import { BODY_NODE_ID, COMPONENT_WRAPPER, NATIVE_TYPES } from './constants';
import ComponentWrapper from './node/element/component-wrapper';

const CONSTRUCTOR_MAP = new Map([['img', Image], ['input', Input], ['textarea', Textarea], ['video', Video]]);

class Document extends EventTarget {
  constructor(pageId) {
    super();

    const { usingComponents = {}, usingPlugins = {} } = cache.getConfig();
    this.usingComponents = usingComponents;
    this.usingPlugins = usingPlugins;

    this.__idMap = new Map();
    this.__pageId = pageId;

    const bodyNodeId = `${BODY_NODE_ID}-${pageId}`;

    this.__root = new RootElement({
      nodeId: bodyNodeId,
      type: 'element',
      tagName: 'body',
      attrs: {},
      children: [],
      document: this,
    });

    cache.setNode(bodyNodeId, this.__root);

    // update body's parentNode
    this.__root.parentNode = this;
  }

  // Event trigger
  _trigger(eventName, options) {
    return this.documentElement._trigger(eventName, options);
  }

  _isRendered() {
    return true;
  }

  _createElement(options) {
    const ConstructorClass = CONSTRUCTOR_MAP.get(options.tagName);
    if (ConstructorClass) {
      return new ConstructorClass(options);
    }

    options.attrs = options.attrs || {};

    if (options.attrs.__native) {
      if (this.usingComponents[options.tagName]) {
        if (options.tagName === COMPONENT_WRAPPER) {
          options.nativeType = NATIVE_TYPES.componentWrapper;
          return new ComponentWrapper(options);
        }
        // Transform to custom-component
        options.nativeType = NATIVE_TYPES.customComponent;
        return new CustomComponent(options);
      } else if (this.usingPlugins[options.tagName]) {
        options.nativeType = NATIVE_TYPES.miniappPlugin;
        return new CustomComponent(options);
      }
    } else {
      return new Element(options);
    }
  }

  _switchPageId(pageId) {
    this.__pageId = pageId;
    const rootNodeId = `${BODY_NODE_ID}-${pageId}`;
    cache.setNode(rootNodeId, this.__root);
  }

  // Node type
  get nodeType() {
    return Node.DOCUMENT_NODE;
  }

  get documentElement() {
    return this.body;
  }

  get body() {
    return this.__root;
  }

  get nodeName() {
    return '#document';
  }

  get defaultView() {
    const { mainPackageName } = cache.getConfig();
    return cache.getWindow(mainPackageName) || null;
  }

  getElementById(id) {
    if (typeof id !== 'string') return;

    const element = this.__idMap.get(id);
    if (element && element._isRendered()) {
      return element;
    }

    return null;
  }

  getElementsByTagName(tagName) {
    if (typeof tagName !== 'string') return [];

    const elements = [];

    cache.getAllNodes().forEach((element) => {
      if (element && element.__tagName === tagName && element._isRendered() && element.__pageId === this.__pageId) {
        elements.push(element);
      }
    });
    return elements;
  }

  getElementsByClassName(className) {
    if (typeof className !== 'string') return [];

    const elements = [];
    cache.getAllNodes().forEach((element) => {
      const classNames = className.trim().split(/\s+/);
      if (element && element._isRendered() && element.__pageId === this.__pageId && classNames.every(c => element.classList && element.classList.contains(c))) {
        elements.push(element);
      }
    });
    return elements;
  }

  querySelector(selector) {
    if (typeof selector !== 'string') return;

    if (selector[0] === '.') {
      const elements = this.getElementsByClassName(selector.slice(1));
      return elements.length > 0 ? elements[0] : null;
    } else if (selector[0] === '#') {
      return this.getElementById(selector.slice(1));
    } else if (/^[a-zA-Z]/.test(selector)) {
      const elements = this.getElementsByTagName(selector);
      return elements.length > 0 ? elements[0] : null;
    }
    return null;
  }

  querySelectorAll(selector) {
    if (typeof selector !== 'string') return [];

    if (selector[0] === '.') {
      return this.getElementsByClassName(selector.slice(1));
    } else if (selector[0] === '#') {
      const element = this.getElementById(selector.slice(1));
      return element ? [element] : [];
    } else if (/^[a-zA-Z]/.test(selector)) {
      return this.getElementsByTagName(selector);
    }
    return null;
  }

  createElement(tagName) {
    return this._createElement({
      document: this,
      tagName
    });
  }

  createElementNS(ns, tagName) {
    // Actually use createElement
    return this.createElement(tagName);
  }

  createTextNode(content) {
    content = '' + content;

    return new TextNode({
      content,
      document: this
    });
  }

  createComment(data) {
    return new Comment({
      document: this,
      data
    });
  }

  createDocumentFragment() {
    return new Element({
      tagName: 'documentfragment',
      nodeType: Node.DOCUMENT_FRAGMENT_NODE,
      document: this
    });
  }

  createEvent() {
    const { mainPackageName } = cache.getConfig();
    const window = cache.getWindow(mainPackageName);

    return new window.CustomEvent();
  }

  addEventListener(eventName, handler, options) {
    this.documentElement.addEventListener(eventName, handler, options);
  }

  removeEventListener(eventName, handler, isCapture) {
    this.documentElement.removeEventListener(eventName, handler, isCapture);
  }

  dispatchEvent(evt) {
    this.documentElement.dispatchEvent(evt);
  }
}

export default function createDocument(pageId) {
  const document = new Document(pageId);

  cache.init(pageId, document);

  return document;
};
