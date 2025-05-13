<template>
  <div class="collectors-page min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-primary-900 font-serif">Коллекционеры</h1>
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CollectorCard v-for="collector in collectorStore.collectors" :key="collector.id" :collector="collector" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCollectorStore } from '../stores/collectorStore'
import CollectorCard from '../components/CollectorCard.vue'

const collectorStore = useCollectorStore()
</script>