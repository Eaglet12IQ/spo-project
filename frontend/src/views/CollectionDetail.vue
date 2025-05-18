<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCollectionStore } from '../stores/collectionStore'
import { useAuthStore } from '../stores/authStore'
import StampCard from '../components/StampCard.vue'
import { fetchWithTokenCheck } from '../utils/http'

const route = useRoute()
const router = useRouter()
const collectionStore = useCollectionStore()
const authStore = useAuthStore()

import type { Profile } from '../types'

const user = ref<Profile | null>(null)

async function fetchCreatorProfile(collectorId: string) {
  try {
    const response = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/profiles/${collectorId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch creator profile')
    }
    const data = await response.json()
    user.value = data
  } catch (error) {
    console.error(error)
    user.value = null
  }
}

onMounted(() => {
  collectionStore.fetchCollectionById(route.params.id as string)
})

const collection = computed(() => collectionStore.getCollection)
const imageVersion = ref(0)

watch(collection, () => {
  // Increment imageVersion to force image reload when collection changes
  imageVersion.value++
})
const collectionStamps = computed(() => collectionStore.getCollectionStamps())

watch(collection, (newCollection) => {
  if (newCollection && newCollection.collector_id) {
    fetchCreatorProfile(newCollection.collector_id.toString())
  }
})

function goToCreateStamp() {
  router.push(`/collections/${route.params.id}/create-stamp`)
}

async function deleteCollection() {
  if (!collection.value) return
  const confirmed = window.confirm('Вы уверены, что хотите удалить эту коллекцию?')
  if (!confirmed) return
  try {
    await collectionStore.deleteCollection(collection.value.id)
    router.push('/collections')
  } catch (error) {
    alert('Ошибка при удалении коллекции')
  }
}
function goToEdit() {
  if (collection.value) {
    router.push(`/collections/${collection.value.id}/edit`)
  }
}
</script>

<template>
  <div v-if="collection" class="collection-detail min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="relative h-64 sm:h-96">
          <img :src="`${collection.photo_url}?v=${imageVersion}`" :alt="collection.name" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 class="text-3xl font-bold font-serif">{{ collection.name }}</h1>
          <p class="mt-2 text-lg">{{ collection.description }}</p>
          <p class="mt-2 text-lg">
            Создатель: 
            <router-link 
              v-if="user" 
              :to="`/profiles/${user.id}`" 
              class="underline hover:text-gray-300"
            >
              {{ user.username }}
            </router-link>
            <span v-else>Загрузка...</span>
          </p>
          <button
            v-if="collection.collector_id == authStore.user?.id"
            @click="goToCreateStamp"
            class="mt-4 mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Добавить марку
          </button>
          <button
            v-if="collection.collector_id == authStore.user?.id"
            @click="goToEdit"
            class="mt-4 mr-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Редактировать коллекцию
          </button>
          <button
            v-if="collection.collector_id == authStore.user?.id"
            @click="deleteCollection"
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Удалить коллекцию
          </button>
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
