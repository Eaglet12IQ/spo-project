<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useCollectionStore } from '../stores/collectionStore'
import { useCollectorStore } from '../stores/collectorStore'
import CollectionCard from '../components/CollectionCard.vue'
import CollectorCard from '../components/CollectorCard.vue'

const collectionStore = useCollectionStore()
const collectorStore = useCollectorStore()

const loading = ref(true)
const viewMode = ref<'all' | 'grouped'>('all')

onMounted(async () => {
  loading.value = true
  await Promise.all([collectorStore.fetchCollectors(), collectionStore.fetchCollections()])
  loading.value = false
})

// Watch viewMode to fetch grouped collections when needed
watch(viewMode, async (newMode) => {
  if (newMode === 'grouped') {
    loading.value = true
    await collectionStore.fetchGroupedCollections()
    loading.value = false
  }
}, { immediate: true })

// Use groupedCollections from store when in grouped mode
const collectionsByOwner = computed(() => {
  if (viewMode.value === 'grouped') {
    return collectionStore.groupedCollections.map(group => ({
      collector: {
        id: group.collector_id,
        first_name: group.first_name,
        last_name: group.last_name,
        avatar_url: group.avatar_url,
        username: group.username,
        country: group.country,
        collectionCount: group.collectionCount,
        stampCount: group.stampCount
      },
      collections: group.collections
    }))
  } else {
    // Fallback to client-side grouping if needed
    const groups: Record<string, { collector: any; collections: any[] }> = {}
    for (const collection of collectionStore.collections) {
      const ownerId = collection.collector_id.toString()
      if (!groups[ownerId]) {
        const collector = collectorStore.getCollectorById(ownerId)
        if (collector) {
          groups[ownerId] = { collector, collections: [] }
        } else {
          groups[ownerId] = { collector: { id: ownerId, username: 'Unknown' }, collections: [] }
        }
      }
      groups[ownerId].collections.push(collection)
    }
    return Object.values(groups)
  }
})
</script>

<template>
  <div class="collections-page min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-primary-900 font-serif mb-8">Коллекции</h1>
      <div class="mb-6 flex space-x-4">
        <button
          :class="['btn', viewMode === 'all' ? 'btn-primary' : 'btn-secondary']"
          @click="viewMode = 'all'"
        >
          Все коллекции
        </button>
        <button
          :class="['btn', viewMode === 'grouped' ? 'btn-primary' : 'btn-secondary']"
          @click="viewMode = 'grouped'"
        >
          Группировка по владельцам
        </button>
      </div>
      <div v-if="loading" class="text-center">Загрузка...</div>
      <div v-else>
        <template v-if="viewMode === 'all'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CollectionCard
              v-for="collection in collectionStore.collections"
              :key="collection.id"
              :collection="collection"
            />
          </div>
        </template>
        <template v-else>
          <div v-for="group in collectionsByOwner" :key="group.collector.id" class="mb-16 border border-gray-300 rounded-lg p-6 bg-white shadow-md">
<div class="mb-6 w-full border-b border-gray-200 pb-4">
  <CollectorCard :collector="group.collector" />
</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <CollectionCard v-for="collection in group.collections" :key="collection.id" :collection="collection" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
