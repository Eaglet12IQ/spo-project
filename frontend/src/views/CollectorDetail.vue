<template>
  <div v-if="collector" class="collector-detail min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-8">
          <div class="flex items-center">
            <img :src="collector.avatar" :alt="collector.name" class="w-24 h-24 rounded-full object-cover" />
            <div class="ml-6">
              <h1 class="text-3xl font-bold font-serif">{{ collector.name }}</h1>
              <p class="text-primary-600">@{{ collector.username }}</p>
              <p class="mt-2 text-primary-700">{{ collector.bio }}</p>
            </div>
          </div>
          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-primary-50 p-6 rounded-lg text-center">
              <div class="text-3xl font-bold text-primary-800">{{ collector.collectionCount }}</div>
              <div class="text-primary-600">Collections</div>
            </div>
            <div class="bg-primary-50 p-6 rounded-lg text-center">
              <div class="text-3xl font-bold text-primary-800">{{ collector.stampCount }}</div>
              <div class="text-primary-600">Stamps</div>
            </div>
            <div class="bg-primary-50 p-6 rounded-lg text-center">
              <div class="text-3xl font-bold text-primary-800">{{ collector.followers }}</div>
              <div class="text-primary-600">Followers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCollectorStore } from '../stores/collectorStore'

const route = useRoute()
const collectorStore = useCollectorStore()

const collector = computed(() => 
  collectorStore.getCollectorById(route.params.id as string)
)
</script>