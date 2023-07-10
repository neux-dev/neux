import { getContext } from './context';
import EventListener from './listener';

/**
 * View
 * 
 * @param {object} config 
 * @param {HTMLElement} target 
 * @returns {HTMLElement}
 */
export function createView(config, target) {
  if (target) {
    const observer = createObserver(target);
    target.addEventListener('removed', () => observer.disconnect(), false);
  }
  const el = render(config);
  if (target) target.appendChild(el);
  return el;
}

function render(config) {
  if (config?.node) return config.node;
  const attrs = { ...config };
  if (attrs.view) {
    const fn = attrs.view;
    delete attrs.view;
    const view = fn(attrs);
    return render(view);
  }
  const {
    tagName = 'DIV',
    namespaceURI,
    attributes,
    children,
    on
  } = attrs;
  delete attrs.tagName;
  delete attrs.namespaceURI;
  delete attrs.attributes;
  delete attrs.children;
  delete attrs.on;
  const el = namespaceURI
    ? document.createElementNS(namespaceURI, tagName)
    : document.createElement(tagName);
  const cleaner = new EventListener();
  el.addEventListener(
    'removed',
    () => cleaner.emit('*'),
    false
  );
  patch(attrs, el, cleaner);
  for (const ev in on) {
    const handler = on[ev];
    if (typeof handler === 'function') {
      el.addEventListener(ev, handler);
    }
  }
  for (const attr in attributes) {
    let val = attributes[attr];
    if (typeof val !== 'undefined') {
      if (typeof val === 'function') {
        const fn = val;
        const updater = () => el.setAttribute(attr, fn());
        val = getContext(fn, (obj, prop) => {
          obj.$$on(prop, updater);
          cleaner.once(attr, () => obj.$$off(prop, updater));
        });
      }
      el.setAttribute(attr, val);
    }
  }
  let _children = children;
  if (typeof children === 'function') {
    _children = getContext(children, (obj, prop, fn) => {
      if (Array.isArray(obj) && prop === '$each' && typeof fn === 'function') {
        const add = (newv, prop, obj) => {
          if (isNaN(prop)) return;
          const index = parseInt(prop);
          const newView = fn(newv, index, obj);
          if (newView) {
            const newChild = render(newView);
            if (newChild) {
              el.appendChild(newChild);
            }
          }
        };
        obj.$$on('#add', add);
        cleaner.once(prop, () => obj.$$off('#add', add));
        const mod = (newv, prop, obj) => {
          if (isNaN(prop)) return;
          const index = parseInt(prop);
          const oldChild = el.children[index];
          const newView = fn(newv, index, obj);
          if (newView) {
            const newChild = render(newView);
            if (newChild && oldChild) {
              el.replaceChild(newChild, oldChild);
            }
          }
        };
        obj.$$on('#mod', mod);
        cleaner.once(prop, () => obj.$$off('#mod', mod));
        const del = (newv, prop, obj) => {
          if (isNaN(prop)) return;
          const index = parseInt(prop);
          const oldChild = el.children[index];
          if (oldChild) {
            el.removeChild(oldChild);
          }
        };
        obj.$$on('#del', del);
        cleaner.once(prop, () => obj.$$off('#del', del));
      } else {
        const fn = children;
        const updater = () => {
          const views = [].concat(fn());
          el.innerHTML = '';
          for (const view of views) {
            const child = render(view);
            el.appendChild(child);
          }
        };
        obj.$$on(prop, updater);
        cleaner.once(prop, () => obj.$$off(prop, updater));
      }
    });
  }
  if (typeof _children === 'object') {
    const views = [].concat(_children);
    for (const view of views) {
      const child = render(view);
      el.appendChild(child);
    }
  }
  return el;
}

function patch(source = {}, target = {}, cleaner) {
  const setValue = (obj, key, val) => {
    if (val !== null && typeof val === 'object') {
      patch(val, obj[key], cleaner);
    } else if (obj[key] !== val) {
      obj[key] = val;
    }
  };
  for (const key in source) {
    let value = source[key];
    if (typeof value === 'function') {
      const fn = value;
      const updater = () => setValue(target, key, fn());
      value = getContext(fn, (obj, prop) => {
        obj.$$on(prop, updater);
        cleaner.once(key, () => obj.$$off(prop, updater));
      });
    }
    setValue(target, key, value);
  }
}

function createObserver(el) {
  const observer = new MutationObserver(function (mutationList) {
    const dispatchEvent = (node, event) => {
      const children = node.children;
      for (let i = 0; i < children.length; i++) {
        dispatchEvent(children[i], event);
      }
      const ev = new Event(event);
      node.dispatchEvent(ev);
    };
    for (const mutation of mutationList) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        dispatchEvent(node, 'mounted');
      });
      mutation.removedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        dispatchEvent(node, 'removed');
      });
    }
  });
  observer.observe(el, { childList: true, subtree: true });
  return observer;
}
