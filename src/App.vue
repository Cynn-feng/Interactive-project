<script setup>
import { onMounted, ref, computed } from 'vue'
import Navbar from './components/Navbar.vue'
import { useLang } from './composables/useLang.js'

const { lang } = useLang()
const showCookieBanner = ref(false)

const cookieTxt = computed(() => lang.value === 'zh' ? {
  message: '本网站使用本地存储保存您的主题偏好和游戏进度，不收集任何个人数据，不向第三方共享信息。',
  accept: '我知道了',
  learn: '了解更多'
} : {
  message: 'This website uses local storage to save your theme preference and game progress. No personal data is collected or shared with third parties.',
  accept: 'Got it',
  learn: 'Learn more'
})

function acceptCookies() {
  localStorage.setItem('circlelab-privacy-accepted', '1')
  showCookieBanner.value = false
}

onMounted(() => {
  const theme = localStorage.getItem('circlelab-theme') || 'dark'
  document.documentElement.setAttribute('data-theme', theme)
  if (!localStorage.getItem('circlelab-privacy-accepted')) {
    setTimeout(() => { showCookieBanner.value = true }, 1200)
  }
})
</script>

<template>
  <Navbar />
  <RouterView />

  <!-- Privacy / Cookie notice -->
  <Transition name="cookie-slide">
    <div v-if="showCookieBanner" class="cookie-banner" role="dialog" aria-live="polite" aria-label="Privacy notice">
      <p class="cookie-banner__text">{{ cookieTxt.message }}</p>
      <div class="cookie-banner__actions">
        <button class="cookie-banner__btn cookie-banner__btn--accept" @click="acceptCookies">
          {{ cookieTxt.accept }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style>
.cookie-banner {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: min(680px, calc(100% - 2rem));
  z-index: 200;
  background: var(--bg-secondary);
  border: 1px solid var(--color-primary);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), 0 0 24px rgba(124, 58, 237, 0.2);
}

.cookie-banner__text {
  flex: 1;
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.55;
}

.cookie-banner__actions {
  flex-shrink: 0;
  display: flex;
  gap: 0.5rem;
}

.cookie-banner__btn {
  padding: 0.45rem 1.1rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid var(--color-primary);
  transition: background 0.2s, box-shadow 0.2s;
}

.cookie-banner__btn--accept {
  background: var(--color-primary);
  color: #fff;
}

.cookie-banner__btn--accept:hover {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.4);
}

.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.cookie-slide-enter-from,
.cookie-slide-leave-to {
  transform: translateX(-50%) translateY(120%);
  opacity: 0;
}

@media (max-width: 600px) {
  .cookie-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
