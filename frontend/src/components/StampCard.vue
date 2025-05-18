<script setup lang="ts">
import { computed } from 'vue'
import type { Stamp } from '../types'

const props = defineProps<{
  stamp: Stamp
  compact?: boolean
}>()

const rarityColor = computed(() => {
  switch(props.stamp.rarity) {
    case 'Редкая': return 'bg-blue-100 text-blue-800'
    case 'Обычная': return 'bg-green-100 text-green-800'
  }
})
</script>

<template>
  <router-link :to="`/stamps/${stamp.id}`" class="block">
    <div 
      class="stamp-card card h-full transition-all duration-300 hover:translate-y-[-5px]"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <div class="relative overflow-hidden aspect-[3/4] bg-gray-100">
        <img 
          :src="stamp.photo_url" 
          :alt="stamp.name" 
          class="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div class="absolute top-2 right-2">
          <span :class="[rarityColor, 'px-2 py-1 rounded-full text-xs font-semibold']">
            {{ stamp.rarity }}
          </span>
        </div>
      </div>
      <div class="p-4">
        <div class="flex justify-between items-start">
          <h3 class="text-lg font-semibold text-primary-900 line-clamp-1">{{ stamp.name }}</h3>
          <span class="text-sm font-medium text-primary-700">{{ stamp.year }} г.</span>
        </div>
        <div class="flex items-center mt-1 text-sm text-primary-600">
          <span>{{ stamp.country }}</span>
          <span class="mx-1">•</span>
          <span>{{ stamp.cost }} ₽</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.stamp-card {
  position: relative;
}

.stamp-card::after {
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

.stamp-card:hover::after {
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.05)
  );
}
</style>