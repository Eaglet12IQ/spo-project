<template>
  <div class="stamps-page min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-primary-900 font-serif">Собрание марок</h1>
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <!-- Можно здесь переключиться на filteredStamps, если нужны фильтры -->
        <StampCard
          v-for="stamp in stampStore.stamps"
          :key="stamp.id"
          :stamp="stamp"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useStampStore } from '../stores/stampStore'
import StampCard from '../components/StampCard.vue'

const stampStore = useStampStore()

onMounted(async () => {
  await stampStore.fetchStamps()
})
</script>
