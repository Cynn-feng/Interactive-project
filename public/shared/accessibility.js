/**
 * CIRCLE LAB - Accessibility Module
 * Font size management with 3 levels.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'circlelab-font-size';

  var FONT_SIZES = {
    small:  '14px',
    normal: '16px',
    large:  '20px'
  };

  var currentLevel = 'normal';

  /**
   * Apply a font size level to the html element.
   * @param {'small'|'normal'|'large'} level
   */
  function setFontSize(level) {
    if (!FONT_SIZES[level]) return;
    currentLevel = level;
    document.documentElement.style.fontSize = FONT_SIZES[level];
    try {
      localStorage.setItem(STORAGE_KEY, level);
    } catch (e) { /* localStorage unavailable */ }
  }

  /**
   * Get the current font size level.
   * @returns {'small'|'normal'|'large'}
   */
  function getFontSize() {
    return currentLevel;
  }

  /**
   * Initialize accessibility features.
   * Reads saved preference from localStorage and applies it.
   */
  function initAccessibility() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && FONT_SIZES[saved]) {
        currentLevel = saved;
      }
    } catch (e) { /* localStorage unavailable */ }

    setFontSize(currentLevel);
  }

  // Auto-initialize when script loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }

  // Public API
  var api = {
    setFontSize: setFontSize,
    getFontSize: getFontSize,
    initAccessibility: initAccessibility
  };

  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = api;
  }

  if (typeof window !== 'undefined') {
    window.CircleLab = window.CircleLab || {};
    window.CircleLab.accessibility = api;
  }
})();
