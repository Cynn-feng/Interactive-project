<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const theorems = [
  {
    id: 1,
    name: 'Angle at Centre Theorem',
    explanation: 'The angle at the centre is twice the angle at the circumference when both are subtended by the same arc.'
  },
  {
    id: 2,
    name: 'Angles in Same Segment',
    explanation: 'Angles subtended by the same arc in the same segment are equal.'
  },
  {
    id: 3,
    name: 'Angle in Semicircle',
    explanation: 'The angle in a semicircle is always 90 degrees.'
  },
  {
    id: 4,
    name: 'Cyclic Quadrilateral',
    explanation: 'Opposite angles in a cyclic quadrilateral sum to 180 degrees.'
  },
  {
    id: 5,
    name: 'Tangent-Radius',
    explanation: 'A tangent to a circle is perpendicular to the radius at the point of contact.'
  },
  {
    id: 6,
    name: 'Tangent Lengths',
    explanation: 'Two tangent lines drawn from an external point to a circle are equal in length.'
  }
]

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
  currentIndex.value = currentIndex.value === 0 ? theorems.length - 1 : currentIndex.value - 1
}

function next() {
  currentIndex.value = currentIndex.value === theorems.length - 1 ? 0 : currentIndex.value + 1
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
      <h2 class="carousel-title">Circle Theorems</h2>
      <p class="carousel-subtitle font-mono">Swipe or click to explore each theorem</p>
    </div>

    <div
      class="carousel"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <!-- Left Arrow -->
      <button class="carousel__arrow carousel__arrow--left" @click="prev" aria-label="Previous theorem">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Slides Track -->
      <div class="carousel__viewport">
        <div class="carousel__track" :style="{ transform: `translateX(${slideOffset})` }">

          <!-- Slide 1: Angle at Centre -->
          <div class="carousel__slide">
            <div class="slide-card">
              <div class="slide-card__svg">
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="glow1" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                  </defs>
                  <!-- Circle -->
                  <circle cx="150" cy="150" r="120" fill="none" stroke="#7C3AED" stroke-width="2" filter="url(#glow1)"/>
                  <!-- Centre O -->
                  <circle cx="150" cy="150" r="5" fill="#7C3AED" filter="url(#glow1)"/>
                  <text x="155" y="142" fill="#A78BFA" font-family="monospace" font-size="14">O</text>
                  <!-- Point A (bottom-left of circle) -->
                  <circle cx="58" cy="210" r="5" fill="#A78BFA" filter="url(#glow1)"/>
                  <text x="40" y="225" fill="#A78BFA" font-family="monospace" font-size="14">A</text>
                  <!-- Point B (bottom-right of circle) -->
                  <circle cx="242" cy="210" r="5" fill="#A78BFA" filter="url(#glow1)"/>
                  <text x="250" y="225" fill="#A78BFA" font-family="monospace" font-size="14">B</text>
                  <!-- Point C (top of circle) -->
                  <circle cx="150" cy="30" r="5" fill="#F43F5E" filter="url(#glow1)"/>
                  <text x="155" y="25" fill="#F43F5E" font-family="monospace" font-size="14">C</text>
                  <!-- Lines OA, OB (centre angle) -->
                  <line x1="150" y1="150" x2="58" y2="210" stroke="#7C3AED" stroke-width="2" filter="url(#glow1)"/>
                  <line x1="150" y1="150" x2="242" y2="210" stroke="#7C3AED" stroke-width="2" filter="url(#glow1)"/>
                  <!-- Lines CA, CB (circumference angle) -->
                  <line x1="150" y1="30" x2="58" y2="210" stroke="#F43F5E" stroke-width="1.5" filter="url(#glow1)"/>
                  <line x1="150" y1="30" x2="242" y2="210" stroke="#F43F5E" stroke-width="1.5" filter="url(#glow1)"/>
                  <!-- Centre angle arc AOB -->
                  <path d="M 131 168 A 25 25 0 0 1 169 168" fill="none" stroke="#7C3AED" stroke-width="2"/>
                  <text x="137" y="190" fill="#7C3AED" font-family="monospace" font-size="11">2α</text>
                  <!-- Circumference angle arc ACB -->
                  <path d="M 140 47 A 18 18 0 0 1 160 47" fill="none" stroke="#F43F5E" stroke-width="2"/>
                  <text x="143" y="65" fill="#F43F5E" font-family="monospace" font-size="11">α</text>
                </svg>
              </div>
              <div class="slide-card__text">
                <h3 class="slide-card__name">{{ theorems[0].name }}</h3>
                <p class="slide-card__explanation">{{ theorems[0].explanation }}</p>
              </div>
            </div>
          </div>

          <!-- Slide 2: Angles in Same Segment -->
          <div class="carousel__slide">
            <div class="slide-card">
              <div class="slide-card__svg">
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                  </defs>
                  <!-- Circle -->
                  <circle cx="150" cy="150" r="120" fill="none" stroke="#7C3AED" stroke-width="2" filter="url(#glow2)"/>
                  <!-- Chord A (left) -->
                  <circle cx="42" cy="105" r="5" fill="#A78BFA" filter="url(#glow2)"/>
                  <text x="22" y="100" fill="#A78BFA" font-family="monospace" font-size="14">A</text>
                  <!-- Chord B (right) -->
                  <circle cx="258" cy="105" r="5" fill="#A78BFA" filter="url(#glow2)"/>
                  <text x="265" y="100" fill="#A78BFA" font-family="monospace" font-size="14">B</text>
                  <!-- Point C (top-left arc) -->
                  <circle cx="80" cy="46" r="5" fill="#F43F5E" filter="url(#glow2)"/>
                  <text x="65" y="38" fill="#F43F5E" font-family="monospace" font-size="14">C</text>
                  <!-- Point D (top-right arc) -->
                  <circle cx="220" cy="46" r="5" fill="#F43F5E" filter="url(#glow2)"/>
                  <text x="228" y="38" fill="#F43F5E" font-family="monospace" font-size="14">D</text>
                  <!-- Lines CA, CB -->
                  <line x1="80" y1="46" x2="42" y2="105" stroke="#F43F5E" stroke-width="1.5" filter="url(#glow2)"/>
                  <line x1="80" y1="46" x2="258" y2="105" stroke="#F43F5E" stroke-width="1.5" filter="url(#glow2)"/>
                  <!-- Lines DA, DB -->
                  <line x1="220" y1="46" x2="42" y2="105" stroke="#F43F5E" stroke-width="1.5" filter="url(#glow2)"/>
                  <line x1="220" y1="46" x2="258" y2="105" stroke="#F43F5E" stroke-width="1.5" filter="url(#glow2)"/>
                  <!-- Angle arc at C -->
                  <path d="M 68 64 A 20 20 0 0 1 98 56" fill="none" stroke="#F43F5E" stroke-width="2"/>
                  <text x="75" y="80" fill="#F43F5E" font-family="monospace" font-size="11">α</text>
                  <!-- Angle arc at D -->
                  <path d="M 202 56 A 20 20 0 0 1 232 64" fill="none" stroke="#F43F5E" stroke-width="2"/>
                  <text x="210" y="80" fill="#F43F5E" font-family="monospace" font-size="11">α</text>
                  <!-- Chord AB -->
                  <line x1="42" y1="105" x2="258" y2="105" stroke="#A78BFA" stroke-width="1" stroke-dasharray="6 4"/>
                </svg>
              </div>
              <div class="slide-card__text">
                <h3 class="slide-card__name">{{ theorems[1].name }}</h3>
                <p class="slide-card__explanation">{{ theorems[1].explanation }}</p>
              </div>
            </div>
          </div>

          <!-- Slide 3: Angle in Semicircle -->
          <div class="carousel__slide">
            <div class="slide-card">
              <div class="slide-card__svg">
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="glow3" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                  </defs>
                  <!-- Circle -->
                  <circle cx="150" cy="150" r="120" fill="none" stroke="#7C3AED" stroke-width="2" filter="url(#glow3)"/>
                  <!-- Diameter A (left) -->
                  <circle cx="30" cy="150" r="5" fill="#A78BFA" filter="url(#glow3)"/>
                  <text x="10" y="145" fill="#A78BFA" font-family="monospace" font-size="14">A</text>
                  <!-- Diameter B (right) -->
                  <circle cx="270" cy="150" r="5" fill="#A78BFA" filter="url(#glow3)"/>
                  <text x="276" y="145" fill="#A78BFA" font-family="monospace" font-size="14">B</text>
                  <!-- Diameter line -->
                  <line x1="30" y1="150" x2="270" y2="150" stroke="#A78BFA" stroke-width="2" filter="url(#glow3)"/>
                  <!-- Point C (top of circle) -->
                  <circle cx="105" cy="37" r="5" fill="#F43F5E" filter="url(#glow3)"/>
                  <text x="88" y="28" fill="#F43F5E" font-family="monospace" font-size="14">C</text>
                  <!-- Lines CA, CB -->
                  <line x1="105" y1="37" x2="30" y2="150" stroke="#F43F5E" stroke-width="1.5" filter="url(#glow3)"/>
                  <line x1="105" y1="37" x2="270" y2="150" stroke="#F43F5E" stroke-width="1.5" filter="url(#glow3)"/>
                  <!-- 90 degree square at C -->
                  <path d="M 93 50 L 83 40 L 93 30" fill="none" stroke="#F43F5E" stroke-width="2"/>
                  <text x="60" y="55" fill="#F43F5E" font-family="monospace" font-size="11">90°</text>
                  <!-- Centre dot -->
                  <circle cx="150" cy="150" r="3" fill="#7C3AED"/>
                </svg>
              </div>
              <div class="slide-card__text">
                <h3 class="slide-card__name">{{ theorems[2].name }}</h3>
                <p class="slide-card__explanation">{{ theorems[2].explanation }}</p>
              </div>
            </div>
          </div>

          <!-- Slide 4: Cyclic Quadrilateral -->
          <div class="carousel__slide">
            <div class="slide-card">
              <div class="slide-card__svg">
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="glow4" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                    </filter>
                  </defs>
                  <!-- Circle -->
                  <circle cx="150" cy="150" r="120" fill="none" stroke="#7C3AED" stroke-width="2" filter="url(#glow4)"/>
                  <!-- Point A (top) -->
                  <circle cx="150" cy="30" r="5" fill="#F43F5E" filter="url(#glow4)"/>
                  <text x="155" y="24" fill="#F43F5E" font-family="monospace" font-size="14">A</text>
                  <!-- Point B (right) -->
                  <circle cx="260" cy="180" r="5" fill="#A78BFA" filter="url(#glow4)"/>
                  <text x="267" y="185" fill="#A78BFA" font-family="monospace" font-size="14">B</text>
                  <!-- Point C (bottom) -->
                  <circle cx="120" cy="268" r="5" fill="#F43F5E" filter="url(#glow4)"/>
                  <text x="105" y="286" fill="#F43F5E" font-family="monospace" font-size="14">C</text>
                  <!-- Point D (left) -->
                  <circle cx="38" cy="120" r="5" fill="#A78BFA" filter="url(#glow4)"/>
                  <text x="18" y="115" fill="#A78BFA" font-family="monospace" font-size="14">D</text>
                  <!-- Quadrilateral sides -->
                  <polygon points="150,30 260,180 120,268 38,120" fill="none" stroke="#7C3AED" stroke-width="1.5" filter="url(#glow4)"/>
                  <!-- Angle arc at A (red) -->
                  <path d="M 140 50 A 22 22 0 0 1 160 50" fill="none" stroke="#F43F5E" stroke-width="2.5"/>
                  <text x="130" y="60" fill="#F43F5E" font-family="monospace" font-size="11">α</text>
                  <!-- Angle arc at C (red) -->
                  <path d="M 108 252 A 22 22 0 0 0 132 252" fill="none" stroke="#F43F5E" stroke-width="2.5"/>
                  <text x="108" y="248" fill="#F43F5E" font-family="monospace" font-size="11">γ</text>
                  <!-- Angle arc at B (purple) -->
                  <path d="M 245 168 A 22 22 0 0 1 248 192" fill="none" stroke="#A78BFA" stroke-width="2.5"/>
                  <text x="232" y="185" fill="#A78BFA" font-family="monospace" font-size="11">β</text>
                  <!-- Angle arc at D (purple) -->
                  <path d="M 50 108 A 22 22 0 0 0 48 132" fill="none" stroke="#A78BFA" stroke-width="2.5"/>
                  <text x="55" y="125" fill="#A78BFA" font-family="monospace" font-size="11">δ</text>
                  <!-- Labels -->
                  <text x="90" y="155" fill="#F43F5E" font-family="monospace" font-size="12">α + γ = 180°</text>
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
            <div class="slide-card">
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
                  <text x="115" y="145" fill="#7C3AED" font-family="monospace" font-size="14">O</text>
                  <!-- Point P (right side of circle) -->
                  <circle cx="230" cy="150" r="5" fill="#F43F5E" filter="url(#glow5)"/>
                  <text x="236" y="145" fill="#F43F5E" font-family="monospace" font-size="14">P</text>
                  <!-- Radius OP -->
                  <line x1="130" y1="150" x2="230" y2="150" stroke="#A78BFA" stroke-width="2" filter="url(#glow5)"/>
                  <!-- Tangent line (vertical through P) -->
                  <line x1="230" y1="40" x2="230" y2="260" stroke="#F43F5E" stroke-width="2" filter="url(#glow5)"/>
                  <!-- 90 degree square at P -->
                  <rect x="216" y="150" width="14" height="14" fill="none" stroke="#F43F5E" stroke-width="1.5"/>
                  <text x="240" y="175" fill="#F43F5E" font-family="monospace" font-size="11">90°</text>
                  <!-- Label tangent -->
                  <text x="240" y="55" fill="#F43F5E" font-family="monospace" font-size="11" opacity="0.7">tangent</text>
                  <!-- Label radius -->
                  <text x="150" y="142" fill="#A78BFA" font-family="monospace" font-size="11" opacity="0.7">radius</text>
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
            <div class="slide-card">
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
      <button class="carousel__arrow carousel__arrow--right" @click="next" aria-label="Next theorem">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
        :aria-label="`Go to theorem ${index + 1}`"
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

.carousel__dot:hover:not(.carousel__dot--active) {
  border-color: #A78BFA;
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  .carousel__track {
    transition: none;
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
</style>
