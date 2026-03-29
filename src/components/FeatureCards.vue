<script setup>
const features = [
  {
    id: 'game',
    title: 'Interactive Games',
    description:
      'Put your circle geometry knowledge to the test with fun, hands-on games. Drag, click, and solve puzzles that bring theorems to life in real time.',
    link: 'game.html',
    icon: 'game'
  },
  {
    id: 'quiz',
    title: 'Challenge Quizzes',
    description:
      'Test your understanding with timed quizzes covering every circle theorem. Track your progress and aim for a perfect score across multiple difficulty levels.',
    link: 'quiz.html',
    icon: 'quiz'
  },
  {
    id: 'learn',
    title: 'Learn Theorems',
    description:
      'Explore beautifully animated explanations of each circle theorem. Step through proofs, see visual demos, and build deep geometric intuition.',
    link: '#theorems',
    icon: 'learn'
  }
]

function handleClick(link) {
  if (link.startsWith('#')) {
    const el = document.getElementById(link.slice(1))
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  } else {
    window.location.href = link
  }
}
</script>

<template>
  <section class="features">
    <div class="features__header">
      <h2 class="features__title">Explore &amp; Learn</h2>
      <div class="features__accent" aria-hidden="true"></div>
    </div>

    <div class="features__grid">
      <article
        v-for="feature in features"
        :key="feature.id"
        class="card"
        @click="handleClick(feature.link)"
      >
        <!-- Game icon -->
        <svg
          v-if="feature.icon === 'game'"
          class="card__icon"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="8" y="18" width="48" height="28" rx="14" stroke="var(--color-primary)" stroke-width="2" />
          <circle cx="22" cy="32" r="6" stroke="var(--color-primary)" stroke-width="2" />
          <line x1="22" y1="26" x2="22" y2="38" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" />
          <line x1="16" y1="32" x2="28" y2="32" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" />
          <circle cx="42" cy="28" r="3" stroke="var(--color-primary)" stroke-width="2" />
          <circle cx="46" cy="36" r="3" stroke="var(--color-primary)" stroke-width="2" />
        </svg>

        <!-- Quiz icon -->
        <svg
          v-if="feature.icon === 'quiz'"
          class="card__icon"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="24" stroke="var(--color-primary)" stroke-width="2" />
          <path
            d="M26 24c0-4 3-7 6-7s6 3 6 7c0 3-2 4-4 5.5S32 32 32 34"
            stroke="var(--color-primary)"
            stroke-width="2"
            stroke-linecap="round"
          />
          <circle cx="32" cy="42" r="2" fill="var(--color-primary)" />
        </svg>

        <!-- Learn icon -->
        <svg
          v-if="feature.icon === 'learn'"
          class="card__icon"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 48V16a4 4 0 014-4h20v36H16a4 4 0 00-4 4z"
            stroke="var(--color-primary)"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            d="M12 48a4 4 0 014-4h20"
            stroke="var(--color-primary)"
            stroke-width="2"
            stroke-linecap="round"
          />
          <circle cx="44" cy="16" r="8" stroke="var(--color-primary)" stroke-width="2" />
          <line x1="44" y1="12" x2="44" y2="8" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" />
          <line x1="40" y1="10" x2="38" y2="7" stroke="var(--color-primary)" stroke-width="1.5" stroke-linecap="round" />
          <line x1="48" y1="10" x2="50" y2="7" stroke="var(--color-primary)" stroke-width="1.5" stroke-linecap="round" />
        </svg>

        <h3 class="card__title">{{ feature.title }}</h3>
        <p class="card__description">{{ feature.description }}</p>
        <span class="card__link">Explore &rarr;</span>
      </article>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding: 4rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.features__header {
  text-align: center;
  margin-bottom: 3rem;
}

.features__title {
  font-family: 'Exo', system-ui, sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.features__accent {
  width: 60px;
  height: 3px;
  margin: 0 auto;
  background: var(--color-primary);
  border-radius: 2px;
  box-shadow: 0 0 12px var(--color-primary);
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* --- Card --- */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--glow-primary);
  transform: translateY(-4px);
}

.card__icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 1.25rem;
  display: block;
}

.card__title {
  font-family: 'Exo', system-ui, sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.card__description {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: 1.25rem;
}

.card__link {
  display: inline-block;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary);
  letter-spacing: 0.04em;
  transition: color 0.3s ease;
}

.card:hover .card__link {
  color: var(--color-cta);
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .features {
    padding: 3rem 1.25rem;
  }

  .features__grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .card {
    padding: 1.5rem 1.25rem;
  }
}
</style>
