<script setup lang="ts">
import { computed } from 'vue'
import type { Collector } from '../types'

const props = defineProps<{
  collector: Collector
}>()

const formattedDate = computed(() => {
  const date = new Date(props.collector.memberSince)
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long'
  }).format(date)
})
</script>

<template>
  <router-link :to="`/collectors/${collector.id}`" class="block">
    <div 
      class="collector-card card h-full transition-all duration-300 hover:translate-y-[-5px]"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      :delay="300"
    >
      <div class="p-6">
        <div class="flex items-start">
          <div class="relative">
            <img 
              :src="collector.avatar" 
              :alt="collector.name" 
              class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div v-if="collector.featured" class="absolute -top-1 -right-1">
              <span class="bg-gold-500 text-white p-1 rounded-full text-xs font-bold flex items-center justify-center" style="width: 20px; height: 20px;">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-primary-900">{{ collector.name }}</h3>
            <div class="text-sm text-primary-500">@{{ collector.username }}</div>
            <div class="text-sm text-primary-600 mt-1">{{ collector.location }}</div>
          </div>
        </div>
        
        <p class="mt-3 text-sm text-primary-600 line-clamp-2">{{ collector.bio }}</p>
        
        <div class="mt-4 flex flex-wrap gap-1">
          <span 
            v-for="specialty in collector.specialties.slice(0, 2)" 
            :key="specialty" 
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
          >
            {{ specialty }}
          </span>
          <span 
            v-if="collector.specialties.length > 2" 
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            +{{ collector.specialties.length - 2 }} more
          </span>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
          <div>
            <div class="text-primary-900 font-semibold">{{ collector.stampCount }}</div>
            <div class="text-xs text-primary-500">Stamps</div>
          </div>
          <div>
            <div class="text-primary-900 font-semibold">{{ collector.collectionCount }}</div>
            <div class="text-xs text-primary-500">Collections</div>
          </div>
          <div>
            <div class="text-primary-900 font-semibold">{{ collector.followers }}</div>
            <div class="text-xs text-primary-500">Followers</div>
          </div>
        </div>
        
        <div class="mt-4 text-xs text-primary-500 text-center">
          Member since {{ formattedDate }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.collector-card {
  position: relative;
}

.collector-card::after {
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

.collector-card:hover::after {
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.05)
  );
}
</style>