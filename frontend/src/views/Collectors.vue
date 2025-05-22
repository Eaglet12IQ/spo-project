<template>
  <div class="collectors-page min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-primary-900 font-serif mb-8">Коллекционеры</h1>
      <div class="mb-6 flex space-x-4">
        <button
          :class="['btn', viewMode === 'all' ? 'btn-primary' : 'btn-secondary']"
          @click="showAllCollectors"
        >
          Все коллекционеры
        </button>
        <button
          :class="['btn', viewMode === 'mostExpensive' ? 'btn-primary' : 'btn-secondary']"
          @click="fetchMostExpensiveCollector"
        >
          Коллекционер с самой дорогой маркой
        </button>
        <button
          :class="['btn', viewMode === 'maxRare' ? 'btn-primary' : 'btn-secondary']"
          @click="fetchMaxRareCollector"
        >
          Коллекционер с максимальным количеством редких марок
        </button>
        <button
          :class="['btn', viewMode === 'sortedByValue' ? 'btn-primary' : 'btn-secondary']"
          @click="fetchCollectorsSortedByValue"
        >
          Сортировать по общей стоимости коллекций
        </button>
        <button
          :class="['btn', viewMode === 'oldStamps' ? 'btn-primary' : 'btn-secondary']"
          @click="fetchCollectorsWithOldStamps"
        >
          Коллекционеры с марками старше 10 лет
        </button>
      </div>
      <div v-if="loading" class="text-center">Загрузка...</div>
      <div v-else>
        <template v-if="viewMode === 'mostExpensive' && mostExpensiveCollector">
          <div class="mb-16 border border-gray-300 rounded-lg p-6 bg-white shadow-md">
            <CollectorCard :collector="mostExpensiveCollector" />
          </div>
        </template>
        <template v-else-if="viewMode === 'maxRare' && maxRareCollector">
          <div class="mb-16 border border-gray-300 rounded-lg p-6 bg-white shadow-md">
            <CollectorCard :collector="maxRareCollector" />
          </div>
        </template>
        <template v-else-if="viewMode === 'sortedByValue' && sortedCollectors.length">
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CollectorCard v-for="collector in sortedCollectors" :key="collector.id ?? collector.user_id" :collector="collector" />
          </div>
        </template>
        <template v-else-if="viewMode === 'oldStamps' && oldStampCollectors.length">
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CollectorCard v-for="collector in oldStampCollectors" :key="collector.id ?? collector.user_id" :collector="collector" />
          </div>
        </template>
        <template v-else>
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CollectorCard v-for="collector in collectorStore.collectors" :key="collector.id" :collector="collector" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCollectorStore } from '../stores/collectorStore'
import CollectorCard from '../components/CollectorCard.vue'
import { fetchWithTokenCheck } from '../utils/http'

const collectorStore = useCollectorStore()
const loading = ref(true)
const mostExpensiveCollector = ref<any>(null)
const maxRareCollector = ref<any>(null)
const sortedCollectors = ref<any[]>([])
const oldStampCollectors = ref<any[]>([])
const viewMode = ref<'all' | 'mostExpensive' | 'maxRare' | 'sortedByValue' | 'oldStamps'>('all')

onMounted(() => {
  loading.value = true
  collectorStore.fetchCollectors().finally(() => {
    loading.value = false
  })
})

function showAllCollectors() {
  viewMode.value = 'all'
  sortedCollectors.value = []
  mostExpensiveCollector.value = null
  maxRareCollector.value = null
}

async function fetchMostExpensiveCollector() {
  loading.value = true
  viewMode.value = 'mostExpensive'
  sortedCollectors.value = []
  maxRareCollector.value = null
  try {
    const response = await fetchWithTokenCheck('http://localhost:8000/api/profiles/most_expensive_stamp_collector')
    if (!response.ok) {
      throw new Error('Failed to fetch collector with most expensive stamp')
    }
    const data = await response.json()
    mostExpensiveCollector.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function fetchMaxRareCollector() {
  loading.value = true
  viewMode.value = 'maxRare'
  sortedCollectors.value = []
  mostExpensiveCollector.value = null
  try {
    const response = await fetchWithTokenCheck('http://localhost:8000/api/profiles/max_rare_stamp_collector')
    if (!response.ok) {
      throw new Error('Failed to fetch collector with max rare stamps')
    }
    const data = await response.json()
    maxRareCollector.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function fetchCollectorsSortedByValue() {
  loading.value = true
  viewMode.value = 'sortedByValue'
  mostExpensiveCollector.value = null
  maxRareCollector.value = null
  oldStampCollectors.value = []
  try {
    const response = await fetchWithTokenCheck('http://localhost:8000/api/profiles/sorted_by_collection_value')
    if (!response.ok) {
      throw new Error('Failed to fetch collectors sorted by collection value')
    }
    const data = await response.json()
    sortedCollectors.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function fetchCollectorsWithOldStamps() {
  loading.value = true
  viewMode.value = 'oldStamps'
  mostExpensiveCollector.value = null
  maxRareCollector.value = null
  sortedCollectors.value = []
  try {
    const response = await fetchWithTokenCheck('http://localhost:8000/api/profiles/collectors_with_old_stamps')
    if (!response.ok) {
      throw new Error('Failed to fetch collectors with old stamps')
    }
    const data = await response.json()
    oldStampCollectors.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
  </script>
