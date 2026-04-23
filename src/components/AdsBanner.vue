<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useLang } from '../composables/useLang.js'

const { lang } = useLang()

const txt = computed(() => lang.value === 'zh' ? {
  label: '广告',
  badge: '限时优惠',
  title: 'MathPro Premium',
  tagline: '掌握数学，超越极限',
  features: ['AI 个性化学习', '分步解题', '无限练习题'],
  cta: '立即免费试用',
  timer: '优惠倒计时',
  users: '已有 12,400+ 学生加入'
} : {
  label: 'Advertisement',
  badge: 'LIMITED OFFER',
  title: 'MathPro Premium',
  tagline: 'Master Maths. Ace Your GCSEs.',
  features: ['AI-Personalised Learning', 'Step-by-Step Solutions', 'Unlimited Practice'],
  cta: 'Try Free for 7 Days',
  timer: 'Offer ends in',
  users: '12,400+ students already enrolled'
})

// countdown: 23 h 59 m 59 s cycling
const h = ref(23)
const m = ref(47)
const s = ref(12)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    s.value--
    if (s.value < 0) { s.value = 59; m.value-- }
    if (m.value < 0) { m.value = 59; h.value-- }
    if (h.value < 0) { h.value = 23; m.value = 59; s.value = 59 }
  }, 1000)
})
onUnmounted(() => clearInterval(timer))

const pad = n => String(n).padStart(2, '0')
</script>

<template>
  <section class="ads-banner" aria-label="Advertisement">
    <!-- bg circles -->
    <div class="ads-bg" aria-hidden="true">
      <div class="ads-bg__ring ads-bg__ring--1"></div>
      <div class="ads-bg__ring ads-bg__ring--2"></div>
      <div class="ads-bg__ring ads-bg__ring--3"></div>
    </div>

    <span class="ads-label font-mono">{{ txt.label }}</span>

    <!-- Left: branding -->
    <div class="ads-brand">
      <span class="ads-badge">{{ txt.badge }}</span>
      <h3 class="ads-title">{{ txt.title }}</h3>
      <p class="ads-tagline">{{ txt.tagline }}</p>
    </div>

    <!-- Centre: features -->
    <ul class="ads-features" aria-label="Features">
      <li v-for="f in txt.features" :key="f" class="ads-feature">
        <svg class="ads-check" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="var(--color-success)" stroke-width="1.5"/>
          <path d="M5 8l2 2 4-4" stroke="var(--color-success)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ f }}
      </li>
    </ul>

    <!-- Right: countdown + CTA -->
    <div class="ads-right">
      <p class="ads-timer-label font-mono">{{ txt.timer }}</p>
      <div class="ads-countdown" aria-live="polite" :aria-label="`${h}h ${m}m ${s}s`">
        <span class="ads-digit">{{ pad(h) }}</span>
        <span class="ads-colon">:</span>
        <span class="ads-digit">{{ pad(m) }}</span>
        <span class="ads-colon">:</span>
        <span class="ads-digit ads-digit--pulse">{{ pad(s) }}</span>
      </div>
      <button class="ads-cta" type="button">{{ txt.cta }}</button>
      <p class="ads-social-proof font-mono">{{ txt.users }}</p>
    </div>
  </section>
</template>

<style scoped>
.ads-banner {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.75rem 2rem;
  background: linear-gradient(135deg,
    rgba(124, 58, 237, 0.12) 0%,
    rgba(244, 63, 94, 0.06) 50%,
    rgba(124, 58, 237, 0.08) 100%);
  border: 1px solid var(--border-color);
  border-top: 2px solid var(--color-primary);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: var(--shadow-card), 0 0 40px rgba(124, 58, 237, 0.08);
}

/* bg rings */
.ads-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.ads-bg__ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--color-primary);
  animation: ring-pulse 6s ease-in-out infinite;
}
.ads-bg__ring--1 { width: 180px; height: 180px; top: -60px; right: 80px; opacity: 0.07; animation-delay: 0s; }
.ads-bg__ring--2 { width: 120px; height: 120px; bottom: -40px; right: 240px; opacity: 0.05; animation-delay: 2s; }
.ads-bg__ring--3 { width: 80px;  height: 80px;  top: 10px;  left: -20px; opacity: 0.06; animation-delay: 4s; }

@keyframes ring-pulse {
  0%, 100% { transform: scale(1);    opacity: 0.07; }
  50%       { transform: scale(1.12); opacity: 0.12; }
}

/* ad label */
.ads-label {
  position: absolute;
  top: 8px; right: 14px;
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  opacity: 0.55;
  z-index: 1;
}

/* brand */
.ads-brand {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}
.ads-badge {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #fff;
  background: var(--color-cta);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  animation: badge-glow 2s ease-in-out infinite;
}
@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 6px rgba(244,63,94,0.4); }
  50%       { box-shadow: 0 0 16px rgba(244,63,94,0.7); }
}
.ads-title {
  font-family: 'Exo', system-ui, sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  line-height: 1.1;
}
.ads-tagline {
  margin-top: 0.3rem;
  font-size: 0.82rem;
  color: var(--text-muted);
}

/* features */
.ads-features {
  position: relative;
  z-index: 1;
  flex: 1;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.ads-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.ads-check {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* right: countdown + cta */
.ads-right {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.ads-timer-label {
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.ads-countdown {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
.ads-digit {
  display: inline-block;
  min-width: 2.2rem;
  padding: 0.25rem 0.4rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: 'Roboto Mono', monospace;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-accent);
  text-align: center;
}
.ads-digit--pulse {
  color: var(--color-cta);
  animation: digit-tick 1s step-end infinite;
}
@keyframes digit-tick {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}
.ads-colon {
  font-family: 'Roboto Mono', monospace;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 2px;
}
.ads-cta {
  padding: 0.6rem 1.4rem;
  font-family: 'Exo', system-ui, sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary), var(--color-cta));
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
}
.ads-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(124, 58, 237, 0.5);
}
.ads-cta:active {
  transform: translateY(0);
}
.ads-social-proof {
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

/* mobile */
@media (max-width: 900px) {
  .ads-features { display: none; }
}
@media (max-width: 680px) {
  .ads-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 1.25rem 1.25rem 1.5rem;
    margin: 0 1rem;
  }
  .ads-right { width: 100%; }
  .ads-countdown { justify-content: center; }
  .ads-cta { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .ads-bg__ring, .ads-badge, .ads-digit--pulse { animation: none; }
}
</style>
