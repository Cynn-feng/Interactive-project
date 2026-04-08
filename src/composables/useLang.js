import { ref } from 'vue'

// Module-level ref — shared across all component instances
const lang = ref((() => {
  try { return localStorage.getItem('circlelab-lang') || 'en' } catch (e) { return 'en' }
})())

export function useLang() {
  function toggleLang() {
    lang.value = lang.value === 'en' ? 'zh' : 'en'
    try { localStorage.setItem('circlelab-lang', lang.value) } catch (e) {}
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: lang.value } }))
  }

  return { lang, toggleLang }
}
