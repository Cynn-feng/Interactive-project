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
        <!-- Outer orbit ring -->
        <circle
          class="hero__orbit-outer"
          cx="200"
          cy="200"
          r="185"
          fill="none"
          stroke="var(--color-primary)"
          stroke-width="1"
          stroke-dasharray="4 16"
        />
        <!-- Main rotating dashed circle -->
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
        <!-- Inner orbit -->
        <circle
          class="hero__orbit-inner"
          cx="200"
          cy="200"
          r="100"
          fill="none"
          stroke="var(--color-secondary)"
          stroke-width="1"
          stroke-dasharray="6 10"
          opacity="0.5"
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
        <!-- Second rotating radius (offset) -->
        <line
          class="hero__radius-2"
          x1="200"
          y1="200"
          x2="300"
          y2="200"
          stroke="var(--color-cta)"
          stroke-width="1.5"
          stroke-linecap="round"
          opacity="0.5"
        />
        <!-- Orbiting dot on outer circle -->
        <circle class="hero__orbit-dot" cx="385" cy="200" r="4" fill="var(--color-secondary)" />
        <!-- Orbiting dot on inner circle -->
        <circle class="hero__orbit-dot-2" cx="300" cy="200" r="3" fill="var(--color-cta)" opacity="0.7" />
        <!-- Floating particles (static positions, CSS animates them) -->
        <circle class="hero__particle hero__particle--1" cx="80"  cy="100" r="2.5" fill="var(--color-secondary)" opacity="0.5"/>
        <circle class="hero__particle hero__particle--2" cx="320" cy="80"  r="2"   fill="var(--color-cta)"       opacity="0.4"/>
        <circle class="hero__particle hero__particle--3" cx="60"  cy="290" r="3"   fill="var(--color-primary)"   opacity="0.35"/>
        <circle class="hero__particle hero__particle--4" cx="340" cy="310" r="2"   fill="var(--color-secondary)" opacity="0.4"/>
        <circle class="hero__particle hero__particle--5" cx="200" cy="60"  r="2.5" fill="var(--color-cta)"       opacity="0.3"/>
        <circle class="hero__particle hero__particle--6" cx="200" cy="340" r="2"   fill="var(--color-primary)"   opacity="0.3"/>
        <!-- Pulsing center dot -->
        <circle
          class="hero__center-dot"
          cx="200"
          cy="200"
          r="6"
          fill="var(--color-primary)"
        />
        <!-- Glow ring around center -->
        <circle
          class="hero__glow-ring"
          cx="200"
          cy="200"
          r="20"
          fill="none"
          stroke="var(--color-primary)"
          stroke-width="1"
          opacity="0.3"
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
  width: min(560px, 88vw);
  height: min(560px, 88vw);
  opacity: 0.45;
  filter: drop-shadow(0 0 20px var(--color-primary));
}

.hero__orbit-outer {
  transform-origin: 200px 200px;
  animation: rotate-circle 40s linear infinite reverse;
}

.hero__dashed-circle {
  transform-origin: 200px 200px;
  animation: rotate-circle 20s linear infinite;
}

.hero__orbit-inner {
  transform-origin: 200px 200px;
  animation: rotate-circle 15s linear infinite reverse;
}

.hero__radius {
  transform-origin: 200px 200px;
  animation: rotate-radius 12s linear infinite;
}

.hero__radius-2 {
  transform-origin: 200px 200px;
  animation: rotate-radius 8s linear infinite reverse;
}

.hero__orbit-dot {
  transform-origin: 200px 200px;
  animation: rotate-radius 12s linear infinite;
}

.hero__orbit-dot-2 {
  transform-origin: 200px 200px;
  animation: rotate-radius 8s linear infinite reverse;
}

.hero__center-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

.hero__glow-ring {
  animation: pulse-ring 3s ease-in-out infinite;
}

/* Floating particles — each with different timing for organic feel */
.hero__particle { animation: particle-float 4s ease-in-out infinite; }
.hero__particle--1 { animation-duration: 4.2s; animation-delay: 0s; }
.hero__particle--2 { animation-duration: 5.1s; animation-delay: 0.8s; }
.hero__particle--3 { animation-duration: 3.8s; animation-delay: 1.4s; }
.hero__particle--4 { animation-duration: 4.7s; animation-delay: 0.3s; }
.hero__particle--5 { animation-duration: 5.5s; animation-delay: 2.1s; }
.hero__particle--6 { animation-duration: 4.0s; animation-delay: 1.7s; }

@keyframes particle-float {
  0%   { transform: translateY(0)    scale(1);    opacity: 0.4; }
  33%  { transform: translateY(-14px) scale(1.3); opacity: 0.7; }
  66%  { transform: translateY(-6px)  scale(0.8); opacity: 0.3; }
  100% { transform: translateY(0)    scale(1);    opacity: 0.4; }
}

@keyframes rotate-circle {
  to { transform: rotate(360deg); }
}

@keyframes rotate-radius {
  to { transform: rotate(360deg); }
}

@keyframes pulse-dot {
  0%, 100% { r: 6; opacity: 1; }
  50% { r: 10; opacity: 0.5; }
}

@keyframes pulse-ring {
  0%, 100% { r: 20; opacity: 0.3; }
  50% { r: 32; opacity: 0.08; }
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
  .hero__orbit-outer,
  .hero__orbit-inner,
  .hero__radius,
  .hero__radius-2,
  .hero__orbit-dot,
  .hero__orbit-dot-2,
  .hero__center-dot,
  .hero__glow-ring,
  .hero__particle,
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
