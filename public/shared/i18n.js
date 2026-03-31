/**
 * CIRCLE LAB - Internationalization (i18n) Module
 * Supports EN/ZH with JSON translation files.
 * Translation files: ./lang/{page}.{lang}.json and ./lang/shared.{lang}.json
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'circlelab-lang';
  var currentLang = 'en';
  var translations = {};

  function getLanguage() {
    return currentLang;
  }

  /**
   * Resolve a nested key like "nav.home" from an object.
   */
  function resolve(obj, key) {
    if (!obj || !key) return undefined;
    var parts = key.split('.');
    var current = obj;
    for (var i = 0; i < parts.length; i++) {
      if (current == null || typeof current !== 'object') return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  /**
   * Determine the current page name from the URL.
   */
  function getPageName() {
    var path = window.location.pathname;
    var filename = path.substring(path.lastIndexOf('/') + 1);
    // Remove extension
    var name = filename.replace(/\.[^.]+$/, '');
    return name || 'index';
  }

  /**
   * Get the base path for lang files (relative to the current page).
   */
  function getLangBasePath() {
    // Look for a <script> tag that loaded i18n.js to determine the shared path
    var scripts = document.querySelectorAll('script[src]');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src');
      if (src && src.indexOf('i18n.js') !== -1) {
        // Get the directory of i18n.js and resolve to ../lang/
        var dir = src.substring(0, src.lastIndexOf('/') + 1);
        return dir + '../lang/';
      }
    }
    // Fallback path from page root.
    return './lang/';
  }

  /**
   * Fetch a JSON file. Returns a Promise-like with callback for older browsers.
   */
  function fetchJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
          try {
            var data = JSON.parse(xhr.responseText);
            callback(null, data);
          } catch (e) {
            callback(e, null);
          }
        } else {
          callback(new Error('Failed to load ' + url), null);
        }
      }
    };
    xhr.send();
  }

  /**
   * Apply translations to all elements with data-i18n and data-i18n-placeholder.
   */
  function applyTranslations() {
    // data-i18n for text content
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var key = elements[i].getAttribute('data-i18n');
      var value = resolve(translations, key);
      if (value !== undefined && typeof value === 'string') {
        elements[i].textContent = value;
      }
    }

    // data-i18n-placeholder for input placeholders
    var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < placeholders.length; j++) {
      var pKey = placeholders[j].getAttribute('data-i18n-placeholder');
      var pValue = resolve(translations, pKey);
      if (pValue !== undefined && typeof pValue === 'string') {
        placeholders[j].setAttribute('placeholder', pValue);
      }
    }
  }

  /**
   * Merge source object into target (shallow-deep merge).
   */
  function deepMerge(target, source) {
    if (!source) return target;
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          target[key] = target[key] || {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    return target;
  }

  /**
   * Set the language and load translation files.
   */
  function setLanguage(lang, callback) {
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* localStorage unavailable */ }

    var basePath = getLangBasePath();
    var pageName = getPageName();
    var loaded = 0;
    var total = 2;
    translations = {};

    function onLoaded() {
      loaded++;
      if (loaded >= total) {
        applyTranslations();
        document.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
        if (typeof callback === 'function') callback();
      }
    }

    // Load shared translations
    fetchJSON(basePath + 'shared.' + lang + '.json', function (err, data) {
      if (!err && data) {
        deepMerge(translations, data);
      }
      onLoaded();
    });

    // Load page-specific translations
    fetchJSON(basePath + pageName + '.' + lang + '.json', function (err, data) {
      if (!err && data) {
        deepMerge(translations, data);
      }
      onLoaded();
    });
  }

  /**
   * Toggle between 'en' and 'zh'.
   */
  function toggleLanguage(callback) {
    var next = currentLang === 'en' ? 'zh' : 'en';
    setLanguage(next, callback);
    return next;
  }

  /**
   * Get a translation value by key.
   */
  function t(key) {
    return resolve(translations, key) || key;
  }

  // Initialize: read from localStorage
  try {
    currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
  } catch (e) {
    currentLang = 'en';
  }

  // Auto-load translations when DOM is ready
  function init() {
    setLanguage(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  var api = {
    getLanguage: getLanguage,
    setLanguage: setLanguage,
    toggleLanguage: toggleLanguage,
    t: t
  };

  // ES module / CommonJS export
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = api;
  }

  // Global export
  if (typeof window !== 'undefined') {
    window.CircleLab = window.CircleLab || {};
    window.CircleLab.i18n = api;
  }
})();
