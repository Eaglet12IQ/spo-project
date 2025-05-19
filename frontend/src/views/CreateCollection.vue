<template>
  <div class="create-page min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Создать новую коллекцию</h1>
    <form @submit.prevent="submitForm" class="space-y-6 bg-white p-6 rounded shadow">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Название</label>
        <input id="name" v-model="name" type="text" required class="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
        <textarea id="description" v-model="description" rows="4" class="w-full border border-gray-300 rounded px-3 py-2 mt-1"></textarea>
      </div>
      <div>
        <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Изображение</label>
        <input id="image" type="file" accept="image/*" @change="onFileChange" class="w-full mt-1" />
      </div>
      <div v-if="errorMessage" class="text-red-600 font-semibold">{{ errorMessage }}</div>
      <div class="flex justify-start">
        <button type="submit" :disabled="isSubmitting" class="btn-primary px-6 py-2 rounded">
          {{ isSubmitting ? 'Создание...' : 'Создать коллекцию' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectionStore } from '../stores/collectionStore'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const collectionStore = useCollectionStore()
const authStore = useAuthStore()

const name = ref('')
const description = ref('')
const imageFile = ref<File | null>(null)
const isSubmitting = ref(false)
const errorMessage = ref('')

onMounted(() => {
  if (!authStore.user) {
    router.push('/login')
  }
})

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    imageFile.value = target.files[0]
  }
}

const submitForm = async () => {
  if (!name.value.trim()) {
    errorMessage.value = 'Название обязательно'
    return
  }
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    const created = await collectionStore.createCollection({
      name: name.value,
      description: description.value,
      imageFile: imageFile.value
    })
    router.push('/collections/' + created.id)
  } catch (error) {
    errorMessage.value = 'Ошибка при создании коллекции'
  } finally {
    isSubmitting.value = false
  }
}
</script>
