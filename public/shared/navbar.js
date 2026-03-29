/**
 * CIRCLE LAB - Navbar Module
 * Creates and injects a responsive navigation bar into any page.
 *
 * Usage: initNavbar({ activePage: 'home' })
 * Pages: 'home', 'game', 'quiz'
 */

(function () {
  'use strict';

  var PAGES = {
    home:  { label: 'Home',  labelZh: '首页', href: 'index.html',  i18nKey: 'nav.home' },
    game:  { label: 'Game',  labelZh: '游戏', href: 'game.html',   i18nKey: 'nav.game' },
    quiz:  { label: 'Quiz',  labelZh: '测验', href: 'quiz.html',   i18nKey: 'nav.quiz' }
  };

  // SVG icons
  var ICON_SUN = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var ICON_MOON = '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function getThemeIcon() {
    var theme = 'dark';
    if (window.CircleLab && window.CircleLab.theme) {
      theme = window.CircleLab.theme.getTheme();
    }
    return theme === 'dark' ? ICON_SUN : ICON_MOON;
  }

  function getLangLabel() {
    var lang = 'en';
    if (window.CircleLab && window.CircleLab.i18n) {
      lang = window.CircleLab.i18n.getLanguage();
    }
    return lang === 'en' ? 'EN' : '中';
  }

  function getActiveLabel(activePage) {
    var page = PAGES[activePage];
    return page ? page.label : 'Page';
  }

  function buildNavbar(options) {
    var activePage = (options && options.activePage) || 'home';

    // -- Navbar container --
    var nav = document.createElement('nav');
    nav.className = 'cl-navbar';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');

    // -- Logo --
    var logo = document.createElement('a');
    logo.className = 'cl-navbar-logo';
    logo.href = 'index.html';
    logo.textContent = 'CIRCLE LAB';

    // -- Menu --
    var menu = document.createElement('ul');
    menu.className = 'cl-navbar-menu';
    menu.id = 'cl-navbar-menu';

    var pageKeys = Object.keys(PAGES);
    for (var i = 0; i < pageKeys.length; i++) {
      var key = pageKeys[i];
      var page = PAGES[key];
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = page.href;
      a.textContent = page.label;
      a.setAttribute('data-i18n', page.i18nKey);
      if (key === activePage) {
        a.className = 'active';
      }
      li.appendChild(a);
      menu.appendChild(li);
    }

    // -- Controls --
    var controls = document.createElement('div');
    controls.className = 'cl-navbar-controls';

    // Language toggle
    var langBtn = document.createElement('button');
    langBtn.className = 'cl-navbar-btn cl-navbar-btn-lang';
    langBtn.id = 'cl-lang-toggle';
    langBtn.textContent = getLangLabel();
    langBtn.title = 'Toggle Language';
    langBtn.setAttribute('aria-label', 'Toggle language');
    langBtn.addEventListener('click', function () {
      if (window.CircleLab && window.CircleLab.i18n) {
        window.CircleLab.i18n.toggleLanguage(function () {
          langBtn.textContent = getLangLabel();
        });
      }
    });

    // Theme toggle
    var themeBtn = document.createElement('button');
    themeBtn.className = 'cl-navbar-btn';
    themeBtn.id = 'cl-theme-toggle';
    themeBtn.innerHTML = getThemeIcon();
    themeBtn.title = 'Toggle Theme';
    themeBtn.setAttribute('aria-label', 'Toggle theme');
    themeBtn.addEventListener('click', function () {
      if (window.CircleLab && window.CircleLab.theme) {
        window.CircleLab.theme.toggleTheme();
        themeBtn.innerHTML = getThemeIcon();
      }
    });

    // Font size group
    var fontGroup = document.createElement('div');
    fontGroup.className = 'cl-font-group';

    var fontLevels = [
      { label: 'A-', cls: 'cl-font-btn-sm', level: 'small' },
      { label: 'A',  cls: 'cl-font-btn-md', level: 'normal' },
      { label: 'A+', cls: 'cl-font-btn-lg', level: 'large' }
    ];

    function createFontBtn(cfg) {
      var btn = document.createElement('button');
      btn.className = 'cl-font-btn ' + cfg.cls;
      btn.textContent = cfg.label;
      btn.title = 'Font size: ' + cfg.level;
      btn.setAttribute('data-font-level', cfg.level);
      btn.addEventListener('click', function () {
        if (window.CircleLab && window.CircleLab.accessibility) {
          window.CircleLab.accessibility.setFontSize(cfg.level);
        }
        // Update active state
        var btns = fontGroup.querySelectorAll('.cl-font-btn');
        for (var b = 0; b < btns.length; b++) {
          btns[b].classList.remove('active');
        }
        btn.classList.add('active');
      });
      return btn;
    }

    for (var f = 0; f < fontLevels.length; f++) {
      var fBtn = createFontBtn(fontLevels[f]);
      if (fontLevels[f].level === 'normal') fBtn.classList.add('active');
      fontGroup.appendChild(fBtn);
    }

    // Hamburger button
    var hamburger = document.createElement('button');
    hamburger.className = 'cl-hamburger';
    hamburger.id = 'cl-hamburger';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.setAttribute('aria-expanded', 'false');
    for (var s = 0; s < 3; s++) {
      hamburger.appendChild(document.createElement('span'));
    }
    hamburger.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Assemble controls
    controls.appendChild(langBtn);
    controls.appendChild(themeBtn);
    controls.appendChild(fontGroup);
    controls.appendChild(hamburger);

    // Assemble navbar
    nav.appendChild(logo);
    nav.appendChild(menu);
    nav.appendChild(controls);

    // -- Breadcrumb --
    var breadcrumb = document.createElement('div');
    breadcrumb.className = 'cl-breadcrumb';
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');

    var bcHome = document.createElement('a');
    bcHome.href = 'index.html';
    bcHome.textContent = 'Home';
    bcHome.setAttribute('data-i18n', 'nav.home');

    var bcSep = document.createElement('span');
    bcSep.className = 'cl-breadcrumb-sep';
    bcSep.textContent = '>';

    var bcCurrent = document.createElement('span');
    bcCurrent.className = 'cl-breadcrumb-current';
    bcCurrent.textContent = getActiveLabel(activePage);
    if (PAGES[activePage]) {
      bcCurrent.setAttribute('data-i18n', PAGES[activePage].i18nKey);
    }

    breadcrumb.appendChild(bcHome);
    breadcrumb.appendChild(bcSep);
    breadcrumb.appendChild(bcCurrent);

    return { nav: nav, breadcrumb: breadcrumb };
  }

  /**
   * Initialize and inject the navbar.
   * @param {Object} options - { activePage: 'home' | 'game' | 'quiz' }
   */
  function initNavbar(options) {
    var result = buildNavbar(options);

    // Insert at the beginning of body
    var body = document.body;
    body.classList.add('has-navbar');

    if (body.firstChild) {
      body.insertBefore(result.breadcrumb, body.firstChild);
      body.insertBefore(result.nav, body.firstChild);
    } else {
      body.appendChild(result.nav);
      body.appendChild(result.breadcrumb);
    }

    // Sync font size button active state with current preference
    try {
      var savedLevel = localStorage.getItem('circlelab-font-size') || 'normal';
      var btns = document.querySelectorAll('.cl-font-btn');
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
        if (btns[i].getAttribute('data-font-level') === savedLevel) {
          btns[i].classList.add('active');
        }
      }
    } catch (e) { /* localStorage unavailable */ }

    // Listen for theme changes to update icon
    document.addEventListener('themechange', function () {
      var themeBtn = document.getElementById('cl-theme-toggle');
      if (themeBtn) {
        themeBtn.innerHTML = getThemeIcon();
      }
    });

    // Listen for language changes to update lang button
    document.addEventListener('languagechange', function () {
      var langBtn = document.getElementById('cl-lang-toggle');
      if (langBtn) {
        langBtn.textContent = getLangLabel();
      }
    });
  }

  // Public API
  var api = {
    initNavbar: initNavbar
  };

  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = api;
  }

  if (typeof window !== 'undefined') {
    window.CircleLab = window.CircleLab || {};
    window.CircleLab.navbar = api;
  }
})();
