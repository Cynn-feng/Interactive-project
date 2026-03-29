<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Theme
const theme = ref(localStorage.getItem('circlelab-theme') || 'dark')
const setTheme = (t) => {
  theme.value = t
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('circlelab-theme', t)
}
const toggleTheme = () => {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

// Language
const lang = ref(localStorage.getItem('circlelab-lang') || 'en')
const toggleLang = () => {
  lang.value = lang.value === 'en' ? 'zh' : 'en'
  localStorage.setItem('circlelab-lang', lang.value)
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: lang.value } }))
}

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

// Breadcrumb
const breadcrumb = computed(() => {
  return sharedText.value.breadcrumb_home
})

// Responsive
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) menuOpen.value = false
}

onMounted(() => {
  setTheme(theme.value)
  initFontSize()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <header class="navbar" role="banner">
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
        <a href="/game.html" class="nav-link">{{ sharedText.game }}</a>
        <a href="/quiz.html" class="nav-link">{{ sharedText.quiz }}</a>
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
        <a href="/game.html" class="mobile-link" @click="closeMenu">{{ sharedText.game }}</a>
        <a href="/quiz.html" class="mobile-link" @click="closeMenu">{{ sharedText.quiz }}</a>

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
    <div class="breadcrumb">
      <span class="breadcrumb-separator">&gt;</span>
      <span class="breadcrumb-current">{{ breadcrumb }}</span>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: var(--nav-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--color-primary);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-weight: bold;
  font-size: 1.1rem;
  transition: opacity 0.2s ease;
}

.navbar-logo:hover {
  opacity: 0.85;
}

.logo-icon {
  font-size: 1.3rem;
}

.logo-text {
  letter-spacing: 1px;
}

[data-theme="dark"] .logo-text {
  text-shadow: 0 0 10px var(--color-primary), 0 0 20px rgba(99, 102, 241, 0.3);
}

/* Nav Links */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.navbar-links.hidden {
  display: none;
}

.nav-link {
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link.active,
.nav-link.router-link-exact-active {
  color: var(--text-primary);
  border-bottom: 2px solid var(--color-primary);
}

/* Controls */
.navbar-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar-controls.hidden {
  display: none;
}

.font-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.8rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.control-btn:hover {
  color: var(--text-primary);
  border-color: var(--color-primary);
}

.control-btn.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.1);
}

.font-btn {
  min-width: 30px;
  height: 30px;
  font-weight: 600;
}

.lang-btn {
  height: 30px;
  font-size: 0.75rem;
  white-space: nowrap;
}

.theme-btn {
  width: 30px;
  height: 30px;
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
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 51;
}

.hamburger-line {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.hamburger.open .hamburger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger.open .hamburger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Menu */
.mobile-menu {
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border-color);
}

.mobile-link {
  display: block;
  text-decoration: none;
  color: var(--text-muted);
  padding: 12px 0;
  font-size: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: color 0.2s ease;
}

.mobile-link:hover,
.mobile-link.active,
.mobile-link.router-link-exact-active {
  color: var(--color-primary);
}

.mobile-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
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
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 24px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  max-width: 1400px;
  margin: 0 auto;
}

.breadcrumb-separator {
  opacity: 0.5;
}

.breadcrumb-current {
  opacity: 0.8;
}
</style>
