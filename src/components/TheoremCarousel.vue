<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLang } from '../composables/useLang.js'

const { lang } = useLang()

const theorems = computed(() => lang.value === 'zh' ? [
  { id: 1, name: '圆心角定理', explanation: '同弧上的圆心角是圆周角的两倍。' },
  { id: 2, name: '同弓形角定理', explanation: '同弧同侧的圆周角相等。' },
  { id: 3, name: '半圆角定理', explanation: '半圆上的圆周角恒为直角（90°）。' },
  { id: 4, name: '圆内接四边形', explanation: '圆内接四边形的对角之和为180°。' },
  { id: 5, name: '切线-半径定理', explanation: '圆的切线与切点处的半径垂直。' },
  { id: 6, name: '等切线长', explanation: '从同一外部点引出的两条切线长度相等。' }
] : [
  { id: 1, name: 'Angle at Centre Theorem', explanation: 'The angle at the centre is twice the angle at the circumference when both are subtended by the same arc.' },
  { id: 2, name: 'Angles in Same Segment', explanation: 'Angles subtended by the same arc in the same segment are equal.' },
  { id: 3, name: 'Angle in Semicircle', explanation: 'The angle in a semicircle is always 90 degrees.' },
  { id: 4, name: 'Cyclic Quadrilateral', explanation: 'Opposite angles in a cyclic quadrilateral sum to 180 degrees.' },
  { id: 5, name: 'Tangent-Radius', explanation: 'A tangent to a circle is perpendicular to the radius at the point of contact.' },
  { id: 6, name: 'Tangent Lengths', explanation: 'Two tangent lines drawn from an external point to a circle are equal in length.' }
])

const carouselTxt = computed(() => lang.value === 'zh' ? {
  title: '圆的定理', subtitle: '滑动或点击探索每个定理'
} : {
  title: 'Circle Theorems', subtitle: 'Swipe or click to explore each theorem'
})

const currentIndex = ref(0)
const isHovered = ref(false)
let autoPlayTimer = null
let touchStartX = 0
let touchEndX = 0

const slideOffset = computed(() => `-${currentIndex.value * 100}%`)

function goTo(index) {
  currentIndex.value = index
}

function prev() {
  currentIndex.value = currentIndex.value === 0 ? theorems.value.length - 1 : currentIndex.value - 1
}

function next() {
  currentIndex.value = currentIndex.value === theorems.value.length - 1 ? 0 : currentIndex.value + 1
}

function onTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX
}

function onTouchEnd(e) {
  touchEndX = e.changedTouches[0].screenX
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    diff > 0 ? next() : prev()
  }
}

function onKeyDown(e) {
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

function startAutoPlay() {
  stopAutoPlay()
  autoPlayTimer = setInterval(() => {
    if (!isHovered.value) next()
  }, 5000)
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// 3D tilt on hover
function onCardMouseMove(e) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const cx = rect.width / 2
  const cy = rect.height / 2
  const rotX = ((y - cy) / cy) * -6
  const rotY = ((x - cx) / cx) * 6
  card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`
}

function onCardMouseLeave(e) {
  e.currentTarget.style.transform = ''
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  startAutoPlay()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  stopAutoPlay()
})
</script>

<template>
  <section id="theorems" class="carousel-section">
    <div class="carousel-header">
      <h2 class="carousel-title">{{ carouselTxt.title }}</h2>
      <p class="carousel-subtitle font-mono">{{ carouselTxt.subtitle }}</p>
    </div>

    <div
      class="carousel"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <!-- Left Arrow -->
      <button
        class="carousel__arrow carousel__arrow--left"
        @click="prev"
        :aria-label="lang === 'zh' ? '上一个定理' : 'Previous theorem'"
        :aria-disabled="theorems.length <= 1"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Slides Track -->
      <div class="carousel__viewport">
        <div class="carousel__track" :style="{ transform: `translateX(${slideOffset})` }">

          <!-- Slide 1: Angle at Centre — filled sectors show 2× relationship -->
          <div class="carousel__slide">
            <div class="slide-card" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
              <div class="slide-card__svg">
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <!-- Circle -->
                  <circle cx="150" cy="150" r="115" fill="none" stroke="#7C3AED" stroke-width="2.5"/>
                  <!-- Purple filled sector at centre (large angle) -->
                  <path d="M 150 150 L 52 202 A 115 115 0 0 1 248 202 Z"
                        fill="#7C3AED" opacity="0.25" stroke="#7C3AED" stroke-width="1.5" stroke-linejoin="round"/>
                  <!-- Red filled triangle at circumference (small angle) -->
                  <path d="M 150 35 L 52 202 L 248 202 Z"
                        fill="#F43F5E" opacity="0.18" stroke="#F43F5E" stroke-width="1.5" stroke-linejoin="round"/>
                  <!-- Centre dot O -->
                  <circle cx="150" cy="150" r="5" fill="#7C3AED"/>
                  <text x="156" y="145" fill="#A78BFA" font-family="monospace" font-size="13" font-weight="700">O</text>
                  <!-- Points -->
                  <circle cx="52"  cy="202" r="5" fill="#A78BFA"/>
                  <text x="28"  y="218" fill="#A78BFA" font-family="monospace" font-size="13">A</text>
                  <circle cx="248" cy="202" r="5" fill="#A78BFA"/>
                  <text x="254" y="218" fill="#A78BFA" font-family="monospace" font-size="13">B</text>
                  <circle cx="150" cy="35"  r="5" fill="#F43F5E"/>
                  <text x="156" y="28"  fill="#F43F5E" font-family="monospace" font-size="13">C</text>
                  <!-- Labels inside sectors -->
                  <text x="120" y="178" fill="#7C3AED" font-family="monospace" font-size="14" font-weight="700">2×</text>
                  <text x="136" y="110" fill="#F43F5E" font-family="monospace" font-size="14" font-weight="700">1×</text>
                </svg>
              </div>
              <div class="slide-card__text">
                <h3 class="slide-card__name">{{ theorems[0].name }}</h3>
                <p class="slide-card__explanation">{{ theorems[0].explanation }}</p>
              </div>
            </div>
          </div>

          <!-- Slide 2: Angles in Same Segment — two identical triangles highlighted -->
          <div class="carousel__slide">
            <div class="slide-card" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
              <div class="slide-card__svg">
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <!-- Circle -->
                  <circle cx="150" cy="150" r="115" fill="none" stroke="#7C3AED" stroke-width="2.5"/>
                  <!-- Chord AB at bottom -->
                  <line x1="52" y1="215" x2="248" y2="215" stroke="#A78BFA" stroke-width="2" stroke-dasharray="7 4"/>
                  <!-- Triangle from C (same red fill) -->
                  <path d="M 90 52 L 52 215 L 248 215 Z"
                        fill="#F43F5E" opacity="0.2" stroke="#F43F5E" stroke-width="2" stroke-linejoin="round"/>
                  <!-- Triangle from D (same red fill — visually equal) -->
                  <path d="M 210 52 L 52 215 L 248 215 Z"
                        fill="#F43F5E" opacity="0.1" stroke="#F43F5E" stroke-width="1.5" stroke-linejoin="round" stroke-dasharray="6 3"/>
                  <!-- Points -->
                  <circle cx="52"  cy="215" r="5" fill="#A78BFA"/>
                  <text x="28"  y="230" fill="#A78BFA" font-family="monospace" font-size="13">A</text>
                  <circle cx="248" cy="215" r="5" fill="#A78BFA"/>
                  <text x="254" y="230" fill="#A78BFA" font-family="monospace" font-size="13">B</text>
                  <circle cx="90"  cy="52"  r="5" fill="#F43F5E"/>
                  <text x="66"  y="44"  fill="#F43F5E" font-family="monospace" font-size="13">C</text>
                  <circle cx="210" cy="52"  r="5" fill="#F43F5E"/>
                  <text x="216" y="44"  fill="#F43F5E" font-family="monospace" font-size="13">D</text>
                  <!-- "=" label in centre -->
                  <text x="126" y="158" fill="#F43F5E" font-family="monospace" font-size="22" font-weight="700">∠C = ∠D</text>
                </svg>
              </div>
              <div class="slide-card__text">
                <h3 class="slide-card__name">{{ theorems[1].name }}</h3>
                <p class="slide-card__explanation">{{ theorems[1].explanation }}</p>
              </div>
            </div>
          </div>

          <!-- Slide 3: Angle in Semicircle — right-angle square marker, no arc labels -->
          <div class="carousel__slide">
            <div class="slide-card" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
              <div class="slide-card__svg">
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <!-- Circle -->
                  <circle cx="150" cy="150" r="115" fill="none" stroke="#7C3AED" stroke-width="2.5"/>
                  <!-- Diameter line -->
                  <line x1="35" y1="150" x2="265" y2="150" stroke="#A78BFA" stroke-width="3"/>
                  <!-- Triangle ACB filled -->
                  <path d="M 100 48 L 35 150 L 265 150 Z"
                        fill="#F43F5E" opacity="0.15" stroke="#F43F5E" stroke-width="2" stroke-linejoin="round"/>
                  <!-- Right-angle square at C — axis-aligned for clarity -->
                  <rect x="100" y="48" width="18" height="18" fill="#F43F5E" opacity="0.5" stroke="#F43F5E" stroke-width="1.5"
                        transform="rotate(-38 109 57)"/>
                  <!-- Points -->
                  <circle cx="35"  cy="150" r="5" fill="#A78BFA"/>
                  <text x="10"  y="146" fill="#A78BFA" font-family="monospace" font-size="13">A</text>
                  <circle cx="265" cy="150" r="5" fill="#A78BFA"/>
                  <text x="270" y="146" fill="#A78BFA" font-family="monospace" font-size="13">B</text>
                  <circle cx="100" cy="48"  r="5" fill="#F43F5E"/>
                  <text x="80"  y="38"  fill="#F43F5E" font-family="monospace" font-size="13">C</text>
                  <!-- Centre dot -->
                  <circle cx="150" cy="150" r="4" fill="#7C3AED"/>
                  <!-- Big 90° label -->
                  <text x="116" y="106" fill="#F43F5E" font-family="monospace" font-size="22" font-weight="700">90°</text>
                </svg>
              </div>
              <div class="slide-card__text">
                <h3 class="slide-card__name">{{ theorems[2].name }}</h3>
                <p class="slide-card__explanation">{{ theorems[2].explanation }}</p>
              </div>
            </div>
          </div>

          <!-- Slide 4: Cyclic Quadrilateral — opposite angles filled in matching colours -->
          <div class="carousel__slide">
            <div class="slide-card" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
              <div class="slide-card__svg">
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <!-- Circle -->
                  <circle cx="150" cy="150" r="115" fill="none" stroke="#7C3AED" stroke-width="2.5"/>
                  <!--
                    4 points evenly on circle (cx=150,cy=150,r=115):
                    A top:    (150, 35)
                    B right:  (250, 183)   cos(-30°)*115+150, sin(-30°)*115+150 ≈ (250,93) — use simpler:
                    Use clock positions: 12, 4, 7, 9 o'clock
                    A (12): 150, 35
                    B (4):  247, 208   (approx on circle)
                    C (7):  90,  255   (approx on circle)
                    D (9):  35,  150
                  -->
                  <!-- Quadrilateral fill: opposite pairs in matching colours -->
                  <!-- Triangle A-B-C-D outline -->
                  <polygon points="150,35 247,195 90,255 35,150"
                           fill="none" stroke="#7C3AED" stroke-width="2"/>
                  <!-- Angle A (red filled wedge using clip) -->
                  <polygon points="150,35 247,195 35,150"
                           fill="#F43F5E" opacity="0.22" stroke="none"/>
                  <!-- Angle C (red — opposite to A) -->
                  <polygon points="90,255 247,195 35,150"
                           fill="#F43F5E" opacity="0.22" stroke="none"/>
                  <!-- Angle B (purple) -->
                  <polygon points="247,195 150,35 90,255"
                           fill="#A78BFA" opacity="0.22" stroke="none"/>
                  <!-- Angle D (purple — opposite to B) -->
                  <polygon points="35,150 150,35 90,255"
                           fill="#A78BFA" opacity="0.22" stroke="none"/>
                  <!-- Redraw outline on top -->
                  <polygon points="150,35 247,195 90,255 35,150"
                           fill="none" stroke="#7C3AED" stroke-width="2"/>
                  <!-- Points -->
                  <circle cx="150" cy="35"  r="5" fill="#F43F5E"/>
                  <text x="156" y="28"  fill="#F43F5E" font-family="monospace" font-size="13">A</text>
                  <circle cx="247" cy="195" r="5" fill="#A78BFA"/>
                  <text x="253" y="193" fill="#A78BFA" font-family="monospace" font-size="13">B</text>
                  <circle cx="90"  cy="255" r="5" fill="#F43F5E"/>
                  <text x="68"  y="272" fill="#F43F5E" font-family="monospace" font-size="13">C</text>
                  <circle cx="35"  cy="150" r="5" fill="#A78BFA"/>
                  <text x="10"  y="148" fill="#A78BFA" font-family="monospace" font-size="13">D</text>
                  <!-- Label -->
                  <text x="96" y="155" fill="#F43F5E" font-family="monospace" font-size="13" font-weight="700">A+C = 180°</text>
                  <text x="96" y="174" fill="#A78BFA" font-family="monospace" font-size="13" font-weight="700">B+D = 180°</text>
                </svg>
              </div>
              <div class="slide-card__text">
                <h3 class="slide-card__name">{{ theorems[3].name }}</h3>
                <p class="slide-card__explanation">{{ theorems[3].explanation }}</p>
              </div>
            </div>
          </div>

          <!-- Slide 5: Tangent-Radius -->
          <div class="carousel__slide">
            <div class="slide-card" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
              <div class="slide-card__svg">
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="glow5" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                  </defs>
                  <!-- Circle -->
                  <circle cx="130" cy="150" r="100" fill="none" stroke="#7C3AED" stroke-width="2" filter="url(#glow5)"/>
                  <!-- Centre O -->
                  <circle cx="130" cy="150" r="5" fill="#7C3AED" filter="url(#glow5)"/>
                  <text x="114" y="145" fill="#7C3AED" font-family="monospace" font-size="14" font-weight="700">O</text>
                  <!-- Point P (right side of circle) -->
                  <circle cx="230" cy="150" r="5" fill="#F43F5E" filter="url(#glow5)"/>
                  <text x="236" y="145" fill="#F43F5E" font-family="monospace" font-size="14">P</text>
                  <!-- Radius OP -->
                  <line x1="130" y1="150" x2="230" y2="150" stroke="#A78BFA" stroke-width="2.5" filter="url(#glow5)"/>
                  <!-- Tangent line (vertical through P) -->
                  <line
                    x1="230"
                    y1="24"
                    x2="230"
                    y2="276"
                    stroke="#F43F5E"
                    stroke-width="3"
                    stroke-linecap="round"
                    filter="url(#glow5)"
                  />
                  <!-- 90 degree marker at P -->
                  <path d="M 230 150 L 214 150 L 214 134 L 230 134" fill="none" stroke="#F43F5E" stroke-width="1.8"/>
                  <text x="236" y="126" fill="#F43F5E" font-family="monospace" font-size="11">90°</text>
                  <!-- Labels -->
                  <text x="236" y="32" fill="#F43F5E" font-family="monospace" font-size="11" opacity="0.8">
                    {{ lang === 'zh' ? '切线' : 'tangent' }}
                  </text>
                  <text x="166" y="140" fill="#A78BFA" font-family="monospace" font-size="11" opacity="0.8">
                    {{ lang === 'zh' ? '半径' : 'radius' }}
                  </text>
                </svg>
              </div>
              <div class="slide-card__text">
                <h3 class="slide-card__name">{{ theorems[4].name }}</h3>
                <p class="slide-card__explanation">{{ theorems[4].explanation }}</p>
              </div>
            </div>
          </div>

          <!-- Slide 6: Tangent Lengths -->
          <div class="carousel__slide">
            <div class="slide-card" @mousemove="onCardMouseMove" @mouseleave="onCardMouseLeave">
              <div class="slide-card__svg">
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="glow6" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                  </defs>
                  <!-- Circle -->
                  <circle cx="130" cy="150" r="90" fill="none" stroke="#7C3AED" stroke-width="2" filter="url(#glow6)"/>
                  <!-- Centre O -->
                  <circle cx="130" cy="150" r="4" fill="#7C3AED" filter="url(#glow6)"/>
                  <text x="118" y="142" fill="#7C3AED" font-family="monospace" font-size="12">O</text>
                  <!-- External point P -->
                  <circle cx="275" cy="150" r="5" fill="#F43F5E" filter="url(#glow6)"/>
                  <text x="280" y="145" fill="#F43F5E" font-family="monospace" font-size="14">P</text>
                  <!-- Tangent point A (upper) -->
                  <circle cx="196" cy="82" r="5" fill="#A78BFA" filter="url(#glow6)"/>
                  <text x="200" y="72" fill="#A78BFA" font-family="monospace" font-size="14">A</text>
                  <!-- Tangent point B (lower) -->
                  <circle cx="196" cy="218" r="5" fill="#A78BFA" filter="url(#glow6)"/>
                  <text x="200" y="238" fill="#A78BFA" font-family="monospace" font-size="14">B</text>
                  <!-- Tangent line PA -->
                  <line x1="275" y1="150" x2="196" y2="82" stroke="#F43F5E" stroke-width="2" filter="url(#glow6)"/>
                  <!-- Tangent line PB -->
                  <line x1="275" y1="150" x2="196" y2="218" stroke="#F43F5E" stroke-width="2" filter="url(#glow6)"/>
                  <!-- Equal marks on PA -->
                  <line x1="232" y1="108" x2="240" y2="118" stroke="#F43F5E" stroke-width="2"/>
                  <line x1="228" y1="110" x2="236" y2="120" stroke="#F43F5E" stroke-width="2"/>
                  <!-- Equal marks on PB -->
                  <line x1="232" y1="192" x2="240" y2="182" stroke="#F43F5E" stroke-width="2"/>
                  <line x1="228" y1="190" x2="236" y2="180" stroke="#F43F5E" stroke-width="2"/>
                  <!-- Radii OA, OB -->
                  <line x1="130" y1="150" x2="196" y2="82" stroke="#7C3AED" stroke-width="1" stroke-dasharray="6 4" opacity="0.5"/>
                  <line x1="130" y1="150" x2="196" y2="218" stroke="#7C3AED" stroke-width="1" stroke-dasharray="6 4" opacity="0.5"/>
                  <!-- Label -->
                  <text x="215" y="152" fill="#F43F5E" font-family="monospace" font-size="11">PA = PB</text>
                </svg>
              </div>
              <div class="slide-card__text">
                <h3 class="slide-card__name">{{ theorems[5].name }}</h3>
                <p class="slide-card__explanation">{{ theorems[5].explanation }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Right Arrow -->
      <button
        class="carousel__arrow carousel__arrow--right"
        @click="next"
        :aria-label="lang === 'zh' ? '下一个定理' : 'Next theorem'"
        :aria-disabled="theorems.length <= 1"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Dot indicators -->
    <div class="carousel__dots">
      <button
        v-for="(theorem, index) in theorems"
        :key="theorem.id"
        class="carousel__dot"
        :class="{ 'carousel__dot--active': index === currentIndex }"
        :aria-label="theorem.name"
        :aria-current="index === currentIndex ? 'true' : undefined"
        @click="goTo(index)"
      />
    </div>
  </section>
</template>

<style scoped>
.carousel-section {
  padding: 5rem 2rem;
  text-align: center;
}

.carousel-header {
  margin-bottom: 3rem;
}

.carousel-title {
  font-family: 'Exo', system-ui, sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--text-primary);
  text-shadow: 0 0 30px rgba(124, 58, 237, 0.35);
  margin-bottom: 0.75rem;
}

.carousel-subtitle {
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
}

.carousel {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 3.25rem;
}

.carousel__viewport {
  flex: 1;
  overflow: hidden;
  border-radius: 12px;
}

.carousel__track {
  display: flex;
  width: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel__slide {
  flex: 0 0 100%;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
}

/* --- Slide Card --- */
.slide-card {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
  will-change: transform;
}

.slide-card:hover {
  box-shadow: var(--shadow-elevated), 0 0 30px rgba(124,58,237,0.12);
}

.slide-card__svg {
  flex: 0 0 45%;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.slide-card__svg svg {
  width: 100%;
  height: auto;
  max-width: 280px;
  max-height: 280px;
}

.slide-card__text {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.slide-card__name {
  font-family: 'Exo', system-ui, sans-serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  text-shadow: 0 0 16px rgba(124, 58, 237, 0.3);
}

.slide-card__explanation {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
}

/* --- Arrows --- */
.carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  transition: box-shadow 0.3s, border-color 0.3s, transform 0.2s;
}

.carousel__arrow--left {
  left: 0;
}

.carousel__arrow--right {
  right: 0;
}

.carousel__arrow:hover {
  border-color: #7C3AED;
  box-shadow: 0 0 16px rgba(124, 58, 237, 0.4);
  transform: translateY(-50%) scale(1.08);
}

.carousel__arrow:focus-visible {
  outline: 2px solid #7C3AED;
  outline-offset: 3px;
}

.carousel__arrow:active {
  transform: translateY(-50%) scale(0.95);
}

/* --- Dots --- */
.carousel__dots {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.carousel__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
  padding: 0;
}

.carousel__dot--active {
  background: #7C3AED;
  border-color: #7C3AED;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.6);
}

.carousel__dot:focus-visible {
  outline: 2px solid #7C3AED;
  outline-offset: 3px;
}

.carousel__dot:hover:not(.carousel__dot--active) {
  border-color: #A78BFA;
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  .carousel__track {
    transition: none;
  }
  .slide-card {
    transition: none;
    transform: none !important;
  }
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .carousel-section {
    padding: 3rem 1rem;
  }

  .slide-card {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.25rem;
  }

  .slide-card__svg {
    flex: none;
    width: 100%;
  }

  .slide-card__svg svg {
    width: 260px;
    height: 260px;
  }

  .slide-card__text {
    text-align: center;
  }

  .carousel__arrow {
    width: 36px;
    height: 36px;
  }

  .carousel__arrow svg {
    width: 18px;
    height: 18px;
  }

  .slide-card__name {
    font-size: 1.15rem;
  }

  .slide-card__explanation {
    font-size: 0.9rem;
  }
}

/* Extra small screens */
@media (max-width: 480px) {
  .carousel-section {
    padding: 2rem 0.5rem;
  }

  .carousel {
    padding: 0 2.25rem;
  }

  .slide-card {
    padding: 1rem;
    gap: 1rem;
  }

  .slide-card__svg svg {
    width: 200px;
    height: 200px;
  }

  .slide-card__name {
    font-size: 1rem;
  }

  .slide-card__explanation {
    font-size: 0.82rem;
    line-height: 1.55;
  }

  .carousel__arrow {
    width: 30px;
    height: 30px;
  }

  .carousel__arrow svg {
    width: 14px;
    height: 14px;
  }

  .carousel-title {
    font-size: 1.6rem;
  }
}
</style>
