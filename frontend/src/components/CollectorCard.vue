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
  <router-link :to="collector.id ? `/profiles/${collector.id}` : '#'" class="block">
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
              :src="collector.avatar_url" 
              :alt="collector.name" 
              class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-primary-900">
              {{
                collector.last_name && collector.first_name
                  ? collector.last_name + " " + collector.first_name[0] + "."
                  : "Аноним"
              }}
            </h3>
            <div class="text-sm text-primary-500">@{{ collector.username }}</div>
<div class="text-sm text-primary-600 mt-1 flex items-center">
  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
  </svg>
  {{ collector.country ? collector.country : "Неизвестно" }}
</div>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-center">
          <div>
            <div class="text-primary-900 font-semibold">{{ collector.stampCount }}</div>
            <div class="text-xs text-primary-500">Марки</div>
          </div>
          <div>
            <div class="text-primary-900 font-semibold">{{ collector.collectionCount }}</div>
            <div class="text-xs text-primary-500">Коллекции</div>
          </div>
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