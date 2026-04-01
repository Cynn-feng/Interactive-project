<script setup>
import { computed } from 'vue'
import { useLang } from '../composables/useLang.js'

const { lang } = useLang()
const txt = computed(() => lang.value === 'zh' ? {
  label: '广告',
  title: '使用 MathPro Premium 掌握数学',
  desc: '高级几何工具、分步解答和个性化学习路径。',
  cta: '了解更多'
} : {
  label: 'Advertisement',
  title: 'Master Mathematics with MathPro Premium',
  desc: 'Advanced geometry tools, step-by-step solutions, and personalized learning paths.',
  cta: 'Learn More'
})
</script>

<template>
  <section class="ads-banner">
    <!-- Decorative geometric pattern -->
    <div class="ads-banner__pattern" aria-hidden="true">
      <div class="ads-banner__circle ads-banner__circle--1"></div>
      <div class="ads-banner__circle ads-banner__circle--2"></div>
      <div class="ads-banner__circle ads-banner__circle--3"></div>
      <div class="ads-banner__line ads-banner__line--1"></div>
      <div class="ads-banner__line ads-banner__line--2"></div>
    </div>

    <span class="ads-banner__label font-mono">{{ txt.label }}</span>

    <div class="ads-banner__content">
      <h3 class="ads-banner__title">{{ txt.title }}</h3>
      <p class="ads-banner__tagline">{{ txt.desc }}</p>
      <button class="ads-banner__cta" type="button">{{ txt.cta }}</button>
    </div>
  </section>
</template>

<style scoped>
.ads-banner {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  max-height: 150px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.06) 0%, rgba(15, 15, 35, 0.9) 100%);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

/* --- Decorative pattern --- */
.ads-banner__pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.ads-banner__circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--color-primary);
  opacity: 0.08;
}

.ads-banner__circle--1 {
  width: 120px;
  height: 120px;
  top: -30px;
  right: -20px;
}

.ads-banner__circle--2 {
  width: 80px;
  height: 80px;
  bottom: -20px;
  right: 60px;
}

.ads-banner__circle--3 {
  width: 50px;
  height: 50px;
  top: 10px;
  left: -10px;
}

.ads-banner__line {
  position: absolute;
  background: var(--color-primary);
  opacity: 0.06;
}

.ads-banner__line--1 {
  width: 200px;
  height: 1px;
  top: 40%;
  right: 5%;
  transform: rotate(-12deg);
}

.ads-banner__line--2 {
  width: 140px;
  height: 1px;
  bottom: 30%;
  right: 15%;
  transform: rotate(8deg);
}

/* --- Label --- */
.ads-banner__label {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  opacity: 0.6;
  z-index: 1;
}

/* --- Content --- */
.ads-banner__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.ads-banner__title {
  font-family: 'Exo', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  flex-shrink: 0;
}

.ads-banner__tagline {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.5;
  flex: 1;
  min-width: 0;
}

.ads-banner__cta {
  flex-shrink: 0;
  padding: 0.5rem 1.25rem;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid var(--color-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  white-space: nowrap;
}

.ads-banner__cta:hover {
  background: rgba(124, 58, 237, 0.15);
  box-shadow: 0 0 16px rgba(124, 58, 237, 0.3);
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .ads-banner {
    max-height: none;
    padding: 1.25rem 1rem;
    margin: 0 1.25rem;
  }

  .ads-banner__content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }

  .ads-banner__title {
    font-size: 0.9rem;
    white-space: normal;
  }

  .ads-banner__tagline {
    font-size: 0.75rem;
  }

  .ads-banner__cta {
    font-size: 0.72rem;
    padding: 0.4rem 1rem;
  }
}
</style>
