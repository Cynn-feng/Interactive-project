<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLang } from '../composables/useLang.js'

const route = useRoute()

// Theme
const theme = ref(localStorage.getItem('circlelab-theme') || 'dark')
const setTheme = (t) => {
  theme.value = t
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('circlelab-theme', t)
}
const toggleTheme = () => {
  const next = theme.value === 'dark' ? 'light' : 'dark'
  if (document.startViewTransition) {
    document.startViewTransition(() => setTheme(next))
  } else {
    setTheme(next)
  }
}

// Language — shared state via composable
const { lang, toggleLang } = useLang()

// Font size
const fontSizes = ['14px', '16px', '20px']
const fontLabels = ['A-', 'A', 'A+']
const currentFontIndex = ref(1)
const initFontSize = () => {
  const saved = localStorage.getItem('circlelab-fontsize')
  if (saved) {
    const idx = fontSizes.indexOf(saved)
    if (idx !== -1) {
      currentFontIndex.value = idx
      document.documentElement.style.fontSize = saved
    }
  }
}
const setFontSize = (index) => {
  currentFontIndex.value = index
  document.documentElement.style.fontSize = fontSizes[index]
  localStorage.setItem('circlelab-fontsize', fontSizes[index])
}

// Reduced motion
const reducedMotion = ref(localStorage.getItem('circlelab-reduced-motion') === '1')
const applyReducedMotion = (val) => {
  if (val) {
    document.documentElement.classList.add('reduced-motion')
  } else {
    document.documentElement.classList.remove('reduced-motion')
  }
  localStorage.setItem('circlelab-reduced-motion', val ? '1' : '0')
}
const toggleReducedMotion = () => {
  reducedMotion.value = !reducedMotion.value
  applyReducedMotion(reducedMotion.value)
}

// Mobile menu
const menuOpen = ref(false)
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
const closeMenu = () => {
  menuOpen.value = false
}

// Shared translations (loaded inline for navbar)
const sharedText = computed(() => {
  if (lang.value === 'zh') {
    return {
      home: '首页', game: '游戏', quiz: '测验',
      breadcrumb_home: '首页', breadcrumb_game: '游戏', breadcrumb_quiz: '测验'
    }
  }
  return {
    home: 'Home', game: 'Game', quiz: 'Quiz',
    breadcrumb_home: 'Home', breadcrumb_game: 'Game', breadcrumb_quiz: 'Quiz'
  }
})

// Breadcrumb — show Home > CurrentPage on sub-pages
const breadcrumbItems = computed(() => {
  const path = route.path
  if (path === '/game' || path.startsWith('/game')) {
    return [
      { label: sharedText.value.breadcrumb_home, to: '/' },
      { label: sharedText.value.breadcrumb_game, to: null }
    ]
  }
  if (path === '/quiz' || path.startsWith('/quiz')) {
    return [
      { label: sharedText.value.breadcrumb_home, to: '/' },
      { label: sharedText.value.breadcrumb_quiz, to: null }
    ]
  }
  return [{ label: sharedText.value.breadcrumb_home, to: null }]
})

// Responsive
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) menuOpen.value = false
}

// Hide on scroll down, show on scroll up
const navHidden = ref(false)
let lastScrollY = 0
const onScroll = () => {
  const current = window.scrollY
  navHidden.value = current > lastScrollY && current > 80
  lastScrollY = current
}

onMounted(() => {
  setTheme(theme.value)
  initFontSize()
  applyReducedMotion(reducedMotion.value)
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="navbar" :class="{ 'navbar--hidden': navHidden }" role="banner">
    <nav class="navbar-inner" role="navigation" aria-label="Main navigation">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo" @click="closeMenu">
        <span class="logo-icon">&#x2B21;</span>
        <span class="logo-text">CIRCLE LAB</span>
      </router-link>

      <!-- Desktop Nav Links -->
      <div class="navbar-links" :class="{ hidden: isMobile }">
        <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">
          {{ sharedText.home }}
        </router-link>
        <a href="/game/index.html" class="nav-link">{{ sharedText.game }}</a>
        <a href="/quiz/index.html" class="nav-link">{{ sharedText.quiz }}</a>
      </div>

      <!-- Desktop Controls -->
      <div class="navbar-controls" :class="{ hidden: isMobile }">
        <!-- Font size buttons -->
        <div class="font-controls" role="group" aria-label="Font size">
          <button
            v-for="(label, index) in fontLabels"
            :key="label"
            class="control-btn font-btn"
            :class="{ active: currentFontIndex === index }"
            @click="setFontSize(index)"
            :aria-label="'Font size ' + label"
          >
            {{ label }}
          </button>
        </div>

        <!-- Language toggle -->
        <button class="control-btn lang-btn" @click="toggleLang" aria-label="Toggle language">
          EN | 中
        </button>

        <!-- Reduced motion toggle -->
        <button
          class="control-btn motion-btn"
          :class="{ active: reducedMotion }"
          @click="toggleReducedMotion"
          :aria-label="reducedMotion ? 'Enable animations' : 'Reduce motion'"
          :title="reducedMotion ? 'Enable animations' : 'Reduce motion'"
        >
          <!-- Animation-on: sine wave -->
          <svg v-if="!reducedMotion" class="theme-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12 C4 6, 8 6, 10 12 S16 18, 18 12 S22 6, 24 12"/>
          </svg>
          <!-- Animation-off: flat line with cross -->
          <svg v-else class="theme-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="2" y1="12" x2="22" y2="12"/>
            <line x1="16" y1="6" x2="22" y2="12"/>
            <line x1="16" y1="18" x2="22" y2="12"/>
          </svg>
        </button>

        <!-- Theme toggle -->
        <button class="control-btn theme-btn" @click="toggleTheme" :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
          <!-- Sun icon (shown in dark mode) -->
          <svg v-if="theme === 'dark'" class="theme-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <!-- Moon icon (shown in light mode) -->
          <svg v-else class="theme-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>

      <!-- Hamburger (mobile) -->
      <button
        v-if="isMobile"
        class="hamburger"
        :class="{ open: menuOpen }"
        @click="toggleMenu"
        aria-label="Toggle menu"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </nav>

    <!-- Mobile Menu -->
    <transition name="slide">
      <div v-if="isMobile && menuOpen" class="mobile-menu">
        <router-link to="/" class="mobile-link" :class="{ active: route.path === '/' }" @click="closeMenu">
          {{ sharedText.home }}
        </router-link>
        <a href="/game/index.html" class="mobile-link" @click="closeMenu">{{ sharedText.game }}</a>
        <a href="/quiz/index.html" class="mobile-link" @click="closeMenu">{{ sharedText.quiz }}</a>

        <div class="mobile-controls">
          <div class="font-controls">
            <button
              v-for="(label, index) in fontLabels"
              :key="label"
              class="control-btn font-btn"
              :class="{ active: currentFontIndex === index }"
              @click="setFontSize(index)"
            >
              {{ label }}
            </button>
          </div>
          <button class="control-btn lang-btn" @click="toggleLang">EN | 中</button>
          <button class="control-btn motion-btn" :class="{ active: reducedMotion }" @click="toggleReducedMotion" :aria-label="reducedMotion ? 'Enable animations' : 'Reduce motion'">
            <svg v-if="!reducedMotion" class="theme-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12 C4 6, 8 6, 10 12 S16 18, 18 12 S22 6, 24 12"/>
            </svg>
            <svg v-else class="theme-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="2" y1="12" x2="22" y2="12"/>
              <line x1="16" y1="6" x2="22" y2="12"/>
              <line x1="16" y1="18" x2="22" y2="12"/>
            </svg>
          </button>
          <button class="control-btn theme-btn" @click="toggleTheme">
            <svg v-if="theme === 'dark'" class="theme-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else class="theme-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <template v-for="(item, index) in breadcrumbItems" :key="index">
        <span v-if="index > 0" class="breadcrumb-separator" aria-hidden="true">&gt;</span>
        <router-link v-if="item.to" :to="item.to" class="breadcrumb-link">{{ item.label }}</router-link>
        <span v-else class="breadcrumb-current" aria-current="page">{{ item.label }}</span>
      </template>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: min(1200px, calc(100% - 32px));
  z-index: 50;
  background: var(--nav-bg);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--glow-secondary), 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
  transition: transform 0.3s ease, opacity 0.3s ease,
              background-color var(--transition-base),
              border-color var(--transition-base);
}

.navbar--hidden {
  transform: translateX(-50%) translateY(calc(-100% - 32px));
  opacity: 0;
  pointer-events: none;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 62px;
  width: 100%;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--color-primary);
  font-family: 'Exo', system-ui, sans-serif;
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: 3px;
  white-space: nowrap;
  transition: color var(--transition-base, 0.2s ease);
}

.navbar-logo:hover {
  color: var(--color-secondary);
}

.logo-icon {
  font-size: 1.2rem;
}

.logo-text {
  letter-spacing: 3px;
}

/* Nav Links */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.navbar-links.hidden {
  display: none;
}

.nav-link {
  position: relative;
  display: inline-block;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 8px 18px;
  border-radius: var(--radius-sm, 6px);
  transition: color 0.2s ease, background-color 0.2s ease;
}

.nav-link:hover {
  color: var(--text-primary);
  background-color: var(--bg-card-hover);
}

.nav-link.active,
.nav-link.router-link-exact-active {
  color: var(--color-accent);
  background: var(--bg-card);
}

.nav-link.active::after,
.nav-link.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 18px;
  right: 18px;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
}

/* Controls */
.navbar-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.navbar-controls.hidden {
  display: none;
}

.font-controls {
  display: flex;
  align-items: center;
  gap: 1px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm, 6px);
  padding: 3px;
  background: var(--bg-card);
}

.control-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm, 6px);
  background: var(--bg-card);
  color: var(--text-muted);
  font-size: 0.82rem;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.control-btn:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: var(--glow-primary);
}

.control-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

/* Font buttons inside the grouped container */
.font-controls .control-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 5px;
  box-shadow: none;
}

.font-controls .control-btn:hover,
.font-controls .control-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: transparent;
  box-shadow: none;
}

.font-btn {
  font-weight: 600;
}

.font-btn:nth-child(1) { font-size: 0.68rem; }
.font-btn:nth-child(2) { font-size: 0.82rem; }
.font-btn:nth-child(3) { font-size: 1rem; }

.lang-btn {
  width: auto;
  padding: 0 12px;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 1px;
}

.theme-btn,
.motion-btn {
  width: 38px;
  height: 38px;
  padding: 0;
}

.theme-icon {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.theme-btn:hover .theme-icon {
  transform: rotate(15deg);
}

/* Hamburger */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 38px;
  height: 38px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm, 6px);
  cursor: pointer;
  padding: 0;
  z-index: 51;
  transition: background-color 0.15s ease;
}

.hamburger-line {
  display: block;
  width: 18px;
  height: 1.5px;
  background: var(--text-primary);
  border-radius: 1px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.hamburger.open .hamburger-line:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}

.hamburger.open .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.open .hamburger-line:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* Mobile Menu */
.mobile-menu {
  display: flex;
  flex-direction: column;
  padding: 14px 18px;
  background: var(--nav-bg);
  border-top: 1px solid var(--border-color);
  gap: 4px;
}

.mobile-link {
  display: block;
  text-decoration: none;
  color: var(--text-muted);
  padding: 11px 14px;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: var(--radius-sm, 6px);
  transition: color 0.2s ease, background-color 0.2s ease;
}

.mobile-link:hover,
.mobile-link.active,
.mobile-link.router-link-exact-active {
  color: var(--color-accent);
  background: var(--bg-card);
}

.mobile-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
  margin-top: 4px;
  flex-wrap: wrap;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 400px;
  opacity: 1;
}

/* Breadcrumb */
.breadcrumb {
  position: fixed;
  top: calc(16px + 62px + 6px);
  left: 50%;
  transform: translateX(-50%);
  width: min(1200px, calc(100% - 32px));
  z-index: 49;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 28px;
  font-family: 'Exo', system-ui, sans-serif;
  font-size: 0.78rem;
  color: var(--text-muted);
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
}

@media (max-width: 768px) {
  .breadcrumb {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    width: 100%;
    padding: 4px 18px;
    font-size: 0.7rem;
  }
  .breadcrumb-current {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
    display: inline-block;
    vertical-align: bottom;
  }
}

.breadcrumb-separator {
  opacity: 0.5;
}

.breadcrumb-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--color-primary);
}

.breadcrumb-current {
  opacity: 0.8;
}
</style>
