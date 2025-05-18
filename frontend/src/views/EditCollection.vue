<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCollectionStore } from '../stores/collectionStore'
import { useAuthStore } from '../stores/authStore'
import type { Collection } from '../types'

const route = useRoute()
const router = useRouter()
const collectionStore = useCollectionStore()
const authStore = useAuthStore()

const collectionId = computed(() => route.params.id as string)
const collection = ref<Collection | null>(null)
const loading = ref(true)
const error = ref('')

const isOwner = computed(() => {
  return collection?.value?.collector_id == authStore.user?.id
})

const name = ref('')
const description = ref('')
const imageFile = ref<File | null>(null)

async function fetchCollection() {
  loading.value = true
  error.value = ''
  try {
    const fetchedCollection = await collectionStore.fetchCollectionById(collectionId.value)
    if (!fetchedCollection?.value) {
      error.value = 'Collection not found'
      return
    }
    collection.value = fetchedCollection.value
    name.value = collection.value.name
    description.value = collection.value.description
  } catch (err) {
    error.value = 'Failed to load collection'
  } finally {
    loading.value = false
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    imageFile.value = target.files[0]
  }
}

async function saveCollection() {
  if (!collection.value) return
  try {
    await collectionStore.updateCollection(collection.value.id, {
      name: name.value,
      description: description.value,
      imageFile: imageFile.value
    })
    // Force reload collection detail page by reloading window
    window.location.href = `/collections/${collection.value.id}`
  } catch (err) {
    error.value = 'Failed to save collection'
  }
}

onMounted(() => {
  fetchCollection()
})
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-4">Редактировать коллекцию</h1>
    <div v-if="loading">Загрузка...</div>
    <div v-else>
      <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>
      <div v-else>
        <div v-if="!isOwner" class="text-red-600">
          У вас нет прав для редактирования этой коллекции.
        </div>
        <form v-else @submit.prevent="saveCollection" class="space-y-4">
          <div>
            <label class="block font-medium mb-1" for="name">Название</label>
            <input id="name" v-model="name" type="text" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1" for="description">Описание</label>
            <textarea id="description" v-model="description" rows="4" class="w-full border rounded px-3 py-2"></textarea>
          </div>
          <div>
            <label class="block font-medium mb-1" for="image">Новое изображение</label>
            <input id="image" type="file" @change="onFileChange" accept="image/*" />
          </div>
          <div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
