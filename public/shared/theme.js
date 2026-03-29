/**
 * CIRCLE LAB - Theme Manager
 * Manages dark/light theme switching with localStorage persistence.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'circlelab-theme';

  function getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) { /* localStorage unavailable */ }
    applyTheme(theme);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  function toggleTheme() {
    var current = getTheme();
    var next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
  }

  // Apply theme immediately on load
  applyTheme(getTheme());

  // Public API
  var api = {
    getTheme: getTheme,
    setTheme: setTheme,
    toggleTheme: toggleTheme
  };

  // ES module export
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = api;
  }

  // Global export
  if (typeof window !== 'undefined') {
    window.CircleLab = window.CircleLab || {};
    window.CircleLab.theme = api;
  }
})();
