/**
 * CIRCLE LAB - Privacy Module
 * Cookie consent banner and privacy policy modal.
 */

(function () {
  'use strict';

  var CONSENT_KEY = 'circlelab-cookie-consent';

  /**
   * Create and show the cookie consent banner.
   */
  function showConsentBanner() {
    if (document.getElementById('cl-consent-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'cl-consent-banner';
    banner.setAttribute('role', 'alert');

    // Inline styles using CSS variables
    var bannerStyle = [
      'position: fixed',
      'bottom: 0',
      'left: 0',
      'right: 0',
      'z-index: 10000',
      'background: var(--bg-secondary)',
      'border-top: 1px solid var(--border-color)',
      'padding: 16px 24px',
      'display: flex',
      'align-items: center',
      'justify-content: space-between',
      'flex-wrap: wrap',
      'gap: 12px',
      'font-size: 0.9rem',
      'color: var(--text-primary)',
      'box-shadow: 0 -4px 20px rgba(0,0,0,0.2)',
      'transition: transform 0.3s ease'
    ].join(';');
    banner.setAttribute('style', bannerStyle);

    var text = document.createElement('p');
    text.setAttribute('style', 'margin: 0; flex: 1; min-width: 200px; line-height: 1.5;');
    text.innerHTML = 'We use cookies and localStorage to save your preferences (theme, language, font size). No tracking cookies are used. ';

    var policyLink = document.createElement('a');
    policyLink.href = '#';
    policyLink.textContent = 'Privacy Policy';
    policyLink.setAttribute('style', 'color: var(--color-secondary); text-decoration: underline; cursor: pointer;');
    policyLink.addEventListener('click', function (e) {
      e.preventDefault();
      showPrivacyPolicy();
    });
    text.appendChild(policyLink);

    var btnGroup = document.createElement('div');
    btnGroup.setAttribute('style', 'display: flex; gap: 8px; flex-shrink: 0;');

    var acceptBtn = document.createElement('button');
    acceptBtn.textContent = 'Accept';
    acceptBtn.setAttribute('style', [
      'padding: 8px 20px',
      'border: none',
      'border-radius: 8px',
      'background: var(--color-primary)',
      'color: #fff',
      'font-size: 0.85rem',
      'font-weight: 600',
      'cursor: pointer',
      'transition: background-color 0.3s, box-shadow 0.3s'
    ].join(';'));
    acceptBtn.addEventListener('mouseenter', function () {
      this.style.boxShadow = 'var(--glow-primary)';
    });
    acceptBtn.addEventListener('mouseleave', function () {
      this.style.boxShadow = 'none';
    });
    acceptBtn.addEventListener('click', function () {
      try {
        localStorage.setItem(CONSENT_KEY, 'accepted');
      } catch (e) { /* localStorage unavailable */ }
      banner.style.transform = 'translateY(100%)';
      setTimeout(function () {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 300);
    });

    btnGroup.appendChild(acceptBtn);
    banner.appendChild(text);
    banner.appendChild(btnGroup);
    document.body.appendChild(banner);
  }

  /**
   * Show the privacy policy modal.
   */
  function showPrivacyPolicy() {
    if (document.getElementById('cl-privacy-modal')) return;

    // Overlay
    var overlay = document.createElement('div');
    overlay.id = 'cl-privacy-modal';
    overlay.setAttribute('style', [
      'position: fixed',
      'top: 0',
      'left: 0',
      'right: 0',
      'bottom: 0',
      'z-index: 10001',
      'background: rgba(0,0,0,0.6)',
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'padding: 20px',
      'animation: cl-fade-in 0.2s ease'
    ].join(';'));

    // Modal box
    var modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Privacy Policy');
    modal.setAttribute('style', [
      'background: var(--bg-secondary)',
      'border: 1px solid var(--border-color)',
      'border-radius: 16px',
      'padding: 32px',
      'max-width: 600px',
      'width: 100%',
      'max-height: 80vh',
      'overflow-y: auto',
      'color: var(--text-primary)',
      'box-shadow: var(--glow-secondary)'
    ].join(';'));

    var title = document.createElement('h2');
    title.textContent = 'Privacy Policy';
    title.setAttribute('style', 'margin: 0 0 16px 0; color: var(--color-primary); font-size: 1.4rem;');

    var content = document.createElement('div');
    content.setAttribute('style', 'line-height: 1.7; font-size: 0.9rem; color: var(--text-primary);');
    content.innerHTML = [
      '<h3 style="color: var(--text-secondary); margin: 16px 0 8px;">Data We Store</h3>',
      '<p>Circle Lab stores the following data <strong>locally in your browser</strong> using localStorage:</p>',
      '<ul style="margin: 8px 0 8px 20px;">',
      '  <li>Theme preference (dark/light)</li>',
      '  <li>Language preference (English/Chinese)</li>',
      '  <li>Font size preference</li>',
      '  <li>Cookie consent acknowledgment</li>',
      '</ul>',
      '<h3 style="color: var(--text-secondary); margin: 16px 0 8px;">No Tracking</h3>',
      '<p>We do <strong>not</strong> use any third-party tracking cookies, analytics services, or advertising networks. All data stays on your device.</p>',
      '<h3 style="color: var(--text-secondary); margin: 16px 0 8px;">No Data Transmission</h3>',
      '<p>Your preferences are never sent to any server. This is a client-side only educational application.</p>',
      '<h3 style="color: var(--text-secondary); margin: 16px 0 8px;">Clearing Your Data</h3>',
      '<p>You can clear all stored data at any time by clearing your browser\'s localStorage for this site, or using your browser\'s "Clear site data" feature.</p>'
    ].join('\n');

    var closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.setAttribute('style', [
      'margin-top: 24px',
      'padding: 10px 24px',
      'border: 1px solid var(--border-color)',
      'border-radius: 8px',
      'background: var(--bg-card)',
      'color: var(--text-primary)',
      'font-size: 0.9rem',
      'cursor: pointer',
      'transition: background-color 0.3s, color 0.3s'
    ].join(';'));
    closeBtn.addEventListener('mouseenter', function () {
      this.style.background = 'var(--color-primary)';
      this.style.color = '#fff';
    });
    closeBtn.addEventListener('mouseleave', function () {
      this.style.background = 'var(--bg-card)';
      this.style.color = 'var(--text-primary)';
    });
    closeBtn.addEventListener('click', function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });

    // Close on overlay click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }
    });

    // Close on Escape key
    function onKeydown(e) {
      if (e.key === 'Escape') {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.removeEventListener('keydown', onKeydown);
      }
    }
    document.addEventListener('keydown', onKeydown);

    modal.appendChild(title);
    modal.appendChild(content);
    modal.appendChild(closeBtn);
    overlay.appendChild(modal);

    // Add fade-in animation
    var style = document.createElement('style');
    style.textContent = '@keyframes cl-fade-in { from { opacity: 0; } to { opacity: 1; } }';
    if (!document.getElementById('cl-privacy-anim')) {
      style.id = 'cl-privacy-anim';
      document.head.appendChild(style);
    }

    document.body.appendChild(overlay);

    // Focus the close button for accessibility
    closeBtn.focus();
  }

  /**
   * Initialize privacy module.
   * Shows consent banner if user hasn't accepted yet.
   */
  function initPrivacy() {
    try {
      var consent = localStorage.getItem(CONSENT_KEY);
      if (consent === 'accepted') return;
    } catch (e) { /* localStorage unavailable */ }

    // Show banner after a short delay for better UX
    setTimeout(showConsentBanner, 500);
  }

  // Public API
  var api = {
    showPrivacyPolicy: showPrivacyPolicy,
    initPrivacy: initPrivacy
  };

  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = api;
  }

  if (typeof window !== 'undefined') {
    window.CircleLab = window.CircleLab || {};
    window.CircleLab.privacy = api;
  }
})();
