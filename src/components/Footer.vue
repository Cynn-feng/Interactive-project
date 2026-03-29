<script setup>
function openPrivacyPolicy() {
  if (window.CircleLab?.privacy?.showPrivacyPolicy) {
    window.CircleLab.privacy.showPrivacyPolicy()
  }
}
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__columns">
        <!-- Column 1: Logo & description -->
        <div class="footer__col">
          <h3 class="footer__logo font-mono">CIRCLE LAB</h3>
          <p class="footer__description">
            An interactive platform for exploring circle geometry through animations, games, and quizzes.
          </p>
        </div>

        <!-- Column 2: Navigation -->
        <div class="footer__col">
          <h4 class="footer__heading">Navigation</h4>
          <nav class="footer__nav" aria-label="Footer navigation">
            <router-link to="/" class="footer__link">Home</router-link>
            <router-link to="/game" class="footer__link">Game</router-link>
            <router-link to="/quiz" class="footer__link">Quiz</router-link>
          </nav>
        </div>

        <!-- Column 3: Legal -->
        <div class="footer__col">
          <h4 class="footer__heading">Legal</h4>
          <nav class="footer__nav" aria-label="Legal links">
            <a href="#" class="footer__link" @click.prevent="openPrivacyPolicy">Privacy Policy</a>
            <a href="#" class="footer__link" @click.prevent>Terms of Use</a>
          </nav>
        </div>
      </div>

      <!-- Data policy notice -->
      <p class="footer__privacy-notice font-mono">
        We respect your privacy. This website does not collect personal data.
      </p>

      <!-- Bottom bar -->
      <div class="footer__bottom">
        <p>&copy; 2026 Circle Lab. All rights reserved. | EBU5315 Interactive Media Design</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--color-primary);
  box-shadow: 0 -4px 20px rgba(124, 58, 237, 0.15);
  padding: 3rem 2rem 0;
  margin-top: 4rem;
}

.footer__inner {
  max-width: 1100px;
  margin: 0 auto;
}

.footer__columns {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2.5rem;
  padding-bottom: 2rem;
}

/* --- Column content --- */
.footer__logo {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;
}

.footer__description {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 300px;
}

.footer__heading {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer__link {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.3s, text-shadow 0.3s;
  width: fit-content;
}

.footer__link:hover {
  color: var(--color-secondary);
  text-shadow: 0 0 10px rgba(124, 58, 237, 0.4);
}

/* --- Privacy notice --- */
.footer__privacy-notice {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
  opacity: 0.7;
}

/* --- Bottom bar --- */
.footer__bottom {
  text-align: center;
  padding: 1.25rem 0;
  border-top: 1px solid var(--border-color);
}

.footer__bottom p {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .footer__columns {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer {
    padding: 2rem 1.5rem 0;
  }

  .footer__description {
    max-width: 100%;
  }
}
</style>
