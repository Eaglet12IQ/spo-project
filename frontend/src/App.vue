<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const isAuthPage = ref(false)

watch(() => route.path, (path) => {
  isAuthPage.value = path === '/login' || path === '/register'
}, { immediate: true })

onMounted(() => {
  document.title = 'PhilateList - Stamp Collection Platform'
})
</script>

<template>
  <div class="app-container min-h-screen flex flex-col">
    <NavBar v-if="!isAuthPage" />
    
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <Footer v-if="!isAuthPage" />
  </div>
</template>

<style>
.app-container {
  @apply antialiased;
}
</style>