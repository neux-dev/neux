import { createState } from './state';

/**
 * Localization
 *
 * locales = { en: {}, ru: {} }
 *
 * @param {object} locales
 * @param {string} fallback
 * @returns {Proxy}
 */
export function createL10n(locales, fallback) {
  if (!fallback) {
    for (fallback in locales) break;
  }
  function t(path, data, lang) {
    if (typeof data === 'string') {
      lang = data;
      data = null;
    }
    if (!lang) lang = state.lang;
    if (!locales[lang]) lang = fallback;
    const arr = `${path}`.split('.');
    let value = arr.reduce((o, k) => {
      if (typeof o === 'object') return o[k];
    }, locales[lang]);
    if (!value) return path;
    for (const k in data) {
      const re = new RegExp(`%\{${k}\}`, 'g');
      value = value.replace(re, data[k]);
    }
    return value;
  }
  const state = createState({
    lang: navigator.language,
    t: function $raw() {
      return t;
    }
  });
  return state;
}
