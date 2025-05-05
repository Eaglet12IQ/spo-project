<script setup lang="ts">
import { computed } from 'vue'
import type { Collection } from '../types'

const props = defineProps<{
  collection: Collection
}>()

const formattedDate = computed(() => {
  const date = new Date(props.collection.updatedAt)
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date)
})
</script>

<template>
  <router-link :to="`/collections/${collection.id}`" class="block">
    <div 
      class="collection-card card h-full transition-all duration-300 hover:translate-y-[-5px]"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      :delay="200"
    >
      <div class="relative overflow-hidden aspect-video bg-gray-100">
        <img 
          :src="collection.coverImage" 
          :alt="collection.title" 
          class="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-4">
          <h3 class="text-xl font-serif font-semibold text-white drop-shadow-sm">{{ collection.title }}</h3>
          <div class="flex items-center mt-1">
            <span class="text-sm font-medium text-white/90">{{ collection.stampCount }} stamps</span>
          </div>
        </div>
      </div>
      <div class="p-4">
        <p class="text-sm text-primary-600 line-clamp-2">{{ collection.description }}</p>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.collection-card {
  position: relative;
}

.collection-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.5rem;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0)
  );
  clip-path: polygon(
    0% 0%,
    100% 0%,
    100% 100%,
    0% 100%
  );
  z-index: 1;
  pointer-events: none;
  transition: all 0.3s ease;
}

.collection-card:hover::after {
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.05)
  );
}
</style>