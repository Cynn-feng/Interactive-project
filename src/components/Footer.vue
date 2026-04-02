<script setup>
import { computed } from 'vue'
import { useLang } from '../composables/useLang.js'

const { lang } = useLang()
const txt = computed(() => lang.value === 'zh' ? {
  desc: '一个面向 GCSE 学生的圆形几何互动学习平台。',
  nav: '导航', home: '首页', game: '游戏', quiz: '测验',
  legal: '法律信息', privacy: '隐私政策', terms: '使用条款',
  dataNotice: '我们尊重您的隐私。本网站不收集个人数据。',
  copyright: '© 2026 Circle Lab. 保留所有权利。 | EBU5315 交互媒体设计与制作'
} : {
  desc: 'An interactive platform for exploring circle geometry through animations, games, and quizzes.',
  nav: 'Navigation', home: 'Home', game: 'Game', quiz: 'Quiz',
  legal: 'Legal', privacy: 'Privacy Policy', terms: 'Terms of Use',
  dataNotice: 'We respect your privacy. This website does not collect personal data.',
  copyright: '© 2026 Circle Lab. All rights reserved. | EBU5315 Interactive Media Design'
})

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
          <p class="footer__description">{{ txt.desc }}</p>
        </div>

        <!-- Column 2: Navigation -->
        <div class="footer__col">
          <h4 class="footer__heading">{{ txt.nav }}</h4>
          <nav class="footer__nav" aria-label="Footer navigation">
            <router-link to="/" class="footer__link">{{ txt.home }}</router-link>
            <router-link to="/game" class="footer__link">{{ txt.game }}</router-link>
            <router-link to="/quiz" class="footer__link">{{ txt.quiz }}</router-link>
          </nav>
        </div>

        <!-- Column 3: Legal -->
        <div class="footer__col">
          <h4 class="footer__heading">{{ txt.legal }}</h4>
          <nav class="footer__nav" aria-label="Legal links">
            <a href="#" class="footer__link" @click.prevent="openPrivacyPolicy">{{ txt.privacy }}</a>
            <a href="#" class="footer__link" @click.prevent>{{ txt.terms }}</a>
          </nav>
        </div>
      </div>

      <!-- Data policy notice -->
      <p class="footer__privacy-notice font-mono">{{ txt.dataNotice }}</p>

      <!-- Bottom bar -->
      <div class="footer__bottom">
        <p>{{ txt.copyright }}</p>
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
