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
    errorMessage.value = 'Name is required'
    return
  }
  isSubmitting.value = true
  errorMessage.value = ''

    try {
      const createdCollection = await collectionStore.createCollection({
        name: name.value,
        description: description.value,
        imageFile: imageFile.value
      })
      router.push('/collections/' + createdCollection.id) // Redirect to the created collection page
    } catch (error) {
      errorMessage.value = 'Failed to create collection'
    } finally {
      isSubmitting.value = false
    }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
    <h1 class="text-2xl font-bold mb-6">Создать новую коллекцию</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label for="name" class="block font-semibold mb-1">Название</label>
        <input id="name" v-model="name" type="text" class="w-full border border-gray-300 rounded px-3 py-2" required />
      </div>
      <div>
        <label for="description" class="block font-semibold mb-1">Описание</label>
        <textarea id="description" v-model="description" rows="4" class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
      </div>
      <div>
        <label for="image" class="block font-semibold mb-1">Изображение</label>
        <input id="image" type="file" accept="image/*" @change="onFileChange" />
      </div>
      <div v-if="errorMessage" class="text-red-600 font-semibold">{{ errorMessage }}</div>
      <div>
        <button type="submit" :disabled="isSubmitting" class="btn-primary">
          {{ isSubmitting ? 'Создание...' : 'Создать коллекцию' }}
        </button>
      </div>
    </form>
  </div>
</template>
