<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLang } from '../composables/useLang.js'

const { lang } = useLang()

const stats = computed(() => lang.value === 'zh' ? [
  { end: 6,     suffix: '',  label: '圆定理覆盖' },
  { end: 3,     suffix: '',  label: '互动游戏模式' },
  { end: 20,    suffix: '+', label: '题库题目' },
  { end: 100,   suffix: '%', label: '免费使用' }
] : [
  { end: 6,     suffix: '',  label: 'Theorems Covered' },
  { end: 3,     suffix: '',  label: 'Game Modes' },
  { end: 20,    suffix: '+', label: 'Quiz Questions' },
  { end: 100,   suffix: '%', label: 'Free to Use' }
])

const displayed = ref([0, 0, 0, 0])
const visible = ref(false)

function animateCount(index, target, duration) {
  const start = performance.now()
  function step(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayed.value[index] = Math.round(eased * target)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !visible.value) {
      visible.value = true
      stats.value.forEach((s, i) => {
        setTimeout(() => animateCount(i, s.end, 1200), i * 120)
      })
      observer.disconnect()
    }
  }, { threshold: 0.3 })
  const el = document.getElementById('stats-bar')
  if (el) observer.observe(el)
})
</script>

<template>
  <section id="stats-bar" class="stats-bar" aria-label="Key statistics">
    <div
      v-for="(stat, i) in stats"
      :key="i"
      class="stats-bar__item"
    >
      <span class="stats-bar__number" aria-live="polite">
        {{ displayed[i] }}{{ stat.suffix }}
      </span>
      <span class="stats-bar__label">{{ stat.label }}</span>
    </div>
  </section>
</template>

<style scoped>
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  max-width: 900px;
  margin: 0 auto 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.stats-bar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  gap: 0.35rem;
  border-right: 1px solid var(--border-color);
  transition: background var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.stats-bar__item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(124,58,237,0.07) 0%, transparent 60%);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.stats-bar__item:hover::before {
  opacity: 1;
}

.stats-bar__item:last-child {
  border-right: none;
}

.stats-bar__number {
  font-family: 'Exo', system-ui, sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 900;
  color: var(--color-primary);
  letter-spacing: -1px;
  line-height: 1;
  text-shadow: 0 0 20px rgba(124,58,237,0.3);
}

.stats-bar__label {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  text-align: center;
}

@media (max-width: 600px) {
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
  .stats-bar__item:nth-child(2) {
    border-right: none;
  }
  .stats-bar__item:nth-child(3),
  .stats-bar__item:nth-child(4) {
    border-top: 1px solid var(--border-color);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stats-bar__number {
    transition: none;
  }
}
</style>
