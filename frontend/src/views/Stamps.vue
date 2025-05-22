<template>
  <div class="stamps-page min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-primary-900 font-serif mb-8">Собрание марок</h1>
      <div class="mb-6 flex space-x-4">
        <button
          :class="['btn', viewMode === 'all' ? 'btn-primary' : 'btn-secondary']"
          @click="viewMode = 'all'"
        >
          Все марки
        </button>
        <button
          :class="['btn', viewMode === 'grouped' ? 'btn-primary' : 'btn-secondary']"
          @click="viewMode = 'grouped'"
        >
          Группировка редких марок по владельцам
        </button>
      </div>
      <div v-if="loading" class="text-center">Загрузка...</div>
      <div v-else>
        <template v-if="viewMode === 'all'">
          <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <StampCard
              v-for="stamp in stampStore.stamps"
              :key="stamp.id"
              :stamp="stamp"
            />
          </div>
        </template>
        <template v-else>
          <div v-for="group in groupedRareStamps" :key="group.collector_id" class="mb-16 border border-gray-300 rounded-lg p-6 bg-white shadow-md">
            <div class="mb-6 w-full border-b border-gray-200 pb-4">
              <CollectorCard :collector="group" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <StampCard v-for="stamp in group.rare_stamps" :key="stamp.id" :stamp="stamp" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useStampStore } from '../stores/stampStore'
import StampCard from '../components/StampCard.vue'
import CollectorCard from '../components/CollectorCard.vue'

const stampStore = useStampStore()
const loading = ref(true)
const viewMode = ref<'all' | 'grouped'>('all')
const groupedRareStamps = ref([])

async function fetchData() {
  loading.value = true
  if (viewMode.value === 'all') {
    await stampStore.fetchStamps()
  } else {
    await stampStore.fetchGroupedRareStamps()
    groupedRareStamps.value = stampStore.groupedRareStamps
  }
  loading.value = false
}

onMounted(fetchData)

watch(viewMode, fetchData)
</script>
