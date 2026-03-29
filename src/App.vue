<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'

onMounted(() => {
  const theme = localStorage.getItem('circlelab-theme') || 'dark'
  document.documentElement.setAttribute('data-theme', theme)
})
</script>

<template>
  <Navbar />
  <RouterView />
</template>
