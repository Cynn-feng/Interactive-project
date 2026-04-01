<script setup>
import { onMounted, ref, computed } from 'vue'
import { useLang } from '../composables/useLang.js'

const { lang } = useLang()
const isVisible = ref(false)

const formulas = [
  { text: 'A = \u03C0r\u00B2', position: 'top-right' },
  { text: 'C = 2\u03C0r', position: 'bottom-left' },
  { text: '\u03B8 = 360\u00B0', position: 'top-left' },
  { text: 'sin\u00B2\u03B8 + cos\u00B2\u03B8 = 1', position: 'bottom-right' }
]

const txt = computed(() => lang.value === 'zh' ? {
  subtitle: '探索几何世界',
  title: '圆',
  description: '通过互动动画、趣味游戏和知识测验，深入了解圆的定理。',
  cta: '开始探索'
} : {
  subtitle: 'EXPLORE THE GEOMETRY OF',
  title: 'The Circle',
  description: 'Discover circle theorems through interactive animations, challenging games, and engaging quizzes.',
  cta: 'Start Exploring'
})

function scrollToTheorems() {
  const section = document.getElementById('theorems')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true
  })
})
</script>

<template>
  <section class="hero">
    <!-- Animated SVG circle background -->
    <div class="hero__circle-container">
      <svg
        class="hero__svg"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <!-- Rotating dashed circle -->
        <circle
          class="hero__dashed-circle"
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="var(--color-primary)"
          stroke-width="2"
          stroke-dasharray="12 8"
        />
        <!-- Rotating radius line -->
        <line
          class="hero__radius"
          x1="200"
          y1="200"
          x2="350"
          y2="200"
          stroke="var(--color-secondary)"
          stroke-width="2"
          stroke-linecap="round"
        />
        <!-- Pulsing center dot -->
        <circle
          class="hero__center-dot"
          cx="200"
          cy="200"
          r="5"
          fill="var(--color-primary)"
        />
      </svg>
    </div>

    <!-- Floating math formulas -->
    <span
      v-for="(formula, index) in formulas"
      :key="index"
      class="hero__formula font-mono"
      :class="`hero__formula--${formula.position}`"
      :style="{ animationDelay: `${index * 0.5}s` }"
      aria-hidden="true"
    >
      {{ formula.text }}
    </span>

    <!-- Content -->
    <div class="hero__content" :class="{ 'hero__content--visible': isVisible }">
      <p class="hero__subtitle font-mono">{{ txt.subtitle }}</p>
      <h1 class="hero__title">{{ txt.title }}</h1>
      <p class="hero__description">{{ txt.description }}</p>
      <button class="hero__cta" @click="scrollToTheorems">{{ txt.cta }}</button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2rem;
}

/* --- SVG Circle Background --- */
.hero__circle-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
}

.hero__svg {
  width: min(500px, 80vw);
  height: min(500px, 80vw);
  opacity: 0.25;
  filter: drop-shadow(0 0 12px var(--color-primary));
}

.hero__dashed-circle {
  transform-origin: 200px 200px;
  animation: rotate-circle 20s linear infinite;
}

.hero__radius {
  transform-origin: 200px 200px;
  animation: rotate-radius 12s linear infinite;
}

.hero__center-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes rotate-circle {
  to { transform: rotate(360deg); }
}

@keyframes rotate-radius {
  to { transform: rotate(360deg); }
}

@keyframes pulse-dot {
  0%, 100% { r: 5; opacity: 1; }
  50% { r: 8; opacity: 0.6; }
}

/* --- Floating Formulas --- */
.hero__formula {
  position: absolute;
  font-size: 0.95rem;
  color: var(--text-secondary);
  opacity: 0.3;
  animation: float-bob 3s ease-in-out infinite;
  z-index: 0;
  user-select: none;
}

.hero__formula--top-right {
  top: 12%;
  right: 10%;
}

.hero__formula--bottom-left {
  bottom: 15%;
  left: 8%;
}

.hero__formula--top-left {
  top: 18%;
  left: 10%;
}

.hero__formula--bottom-right {
  bottom: 12%;
  right: 8%;
}

@keyframes float-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* --- Content --- */
.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 640px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.hero__content--visible {
  opacity: 1;
  transform: translateY(0);
}

.hero__subtitle {
  font-size: 0.8rem;
  letter-spacing: 0.25em;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.hero__title {
  font-family: 'Exo', system-ui, sans-serif;
  font-size: clamp(2.8rem, 8vw, 5rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 1.25rem;
  text-shadow: 0 0 30px rgba(124, 58, 237, 0.35);
}

.hero__description {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.hero__cta {
  display: inline-block;
  padding: 0.85rem 2.4rem;
  font-family: 'Exo', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: 6px;
  cursor: pointer;
  box-shadow: var(--glow-primary), inset 0 0 12px rgba(124, 58, 237, 0.1);
  transition: background 0.3s, box-shadow 0.3s, transform 0.2s;
}

.hero__cta:hover {
  background: rgba(124, 58, 237, 0.15);
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.5), inset 0 0 20px rgba(124, 58, 237, 0.15);
  transform: translateY(-2px);
}

.hero__cta:active {
  transform: translateY(0);
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  .hero__dashed-circle,
  .hero__radius,
  .hero__center-dot,
  .hero__formula {
    animation: none;
  }

  .hero__content {
    opacity: 1;
    transform: translateY(0);
    transition: none;
  }
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .hero {
    min-height: calc(100vh - 56px);
    padding: 1.5rem;
  }

  .hero__formula {
    font-size: 0.75rem;
  }

  .hero__description {
    font-size: 1rem;
  }
}
</style>
