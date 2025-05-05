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
            <span class="text-sm font-medium text-white/90">{{ collection.theme }}</span>
            <span class="mx-2 text-white/70">•</span>
            <span class="text-sm font-medium text-white/90">{{ collection.stampCount }} stamps</span>
          </div>
        </div>
        
        <div v-if="collection.featured" class="absolute top-2 left-2">
          <span class="bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </span>
        </div>
      </div>
      <div class="p-4">
        <p class="text-sm text-primary-600 line-clamp-2">{{ collection.description }}</p>
        <div class="mt-3 flex justify-between items-center text-sm text-primary-500">
          <span>Updated {{ formattedDate }}</span>
          <span v-if="collection.isPublic" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
            Public
          </span>
          <span v-else class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            Private
          </span>
        </div>
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