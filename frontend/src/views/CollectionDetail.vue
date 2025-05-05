<template>
  <div v-if="collection" class="collection-detail min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="relative h-64 sm:h-96">
          <img :src="collection.coverImage" :alt="collection.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 class="text-3xl font-bold font-serif">{{ collection.title }}</h1>
            <p class="mt-2 text-lg">{{ collection.description }}</p>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StampCard v-for="stamp in collectionStamps" :key="stamp.id" :stamp="stamp" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCollectionStore } from '../stores/collectionStore'
import StampCard from '../components/StampCard.vue'

const route = useRoute()
const collectionStore = useCollectionStore()

const collection = computed(() => 
  collectionStore.getCollectionById(route.params.id as string)
)

const collectionStamps = computed(() => 
  collectionStore.getCollectionStamps(route.params.id as string)
)
</script>