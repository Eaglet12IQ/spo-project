<template>
  <div class="create-stamp-page min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Добавить марку в коллекцию</h1>
    <form @submit.prevent="submitForm" class="space-y-6 bg-white p-6 rounded shadow" enctype="multipart/form-data">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Название марки</label>
        <input v-model="form.name" id="name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>
      <div>
        <label for="serial_number" class="block text-sm font-medium text-gray-700">Серийный номер</label>
        <input v-model="form.serial_number" id="serial_number" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>
      <div>
        <label for="country" class="block text-sm font-medium text-gray-700">Страна</label>
        <input v-model="form.country" id="country" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>
      <div>
        <label for="year" class="block text-sm font-medium text-gray-700">Год выпуска</label>
        <input v-model.number="form.year" id="year" type="number" required min="0" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>
      <div>
        <label for="circulation" class="block text-sm font-medium text-gray-700">Тираж</label>
        <input v-model.number="form.circulation" id="circulation" type="number" min="0" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>
      <div>
        <label for="cost" class="block text-sm font-medium text-gray-700">Стоимость</label>
        <input v-model.number="form.cost" id="cost" type="number" min="0" step="0.01" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>
      <div>
        <label for="perforation" class="block text-sm font-medium text-gray-700">Перфорация</label>
        <input v-model="form.perforation" id="perforation" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>
      <div>
        <label for="topic" class="block text-sm font-medium text-gray-700">Тема</label>
        <input v-model="form.topic" id="topic" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>
      <div>
        <label for="features" class="block text-sm font-medium text-gray-700">Особенности</label>
        <textarea v-model="form.features" id="features" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
      </div>
      <div>
        <label for="image" class="block text-sm font-medium text-gray-700">Изображение</label>
        <input @change="handleFileChange" id="image" type="file" accept="image/*" class="mt-1 block w-full" />
      </div>
      <div class="flex justify-end">
        <button type="submit" class="btn-primary px-6 py-2 rounded">Создать</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStampStore } from '../stores/stampStore'
import { useAuthStore } from '../stores/authStore'
import { useCollectionStore } from '../stores/collectionStore'

const route = useRoute()
const router = useRouter()
const stampStore = useStampStore()
const authStore = useAuthStore()
const collectionStore = useCollectionStore()

const collectionId = route.params.id as string

const form = reactive({
  name: '',
  serial_number: '',
  country: '',
  year: new Date().getFullYear(),
  circulation: null as number | null,
  cost: null as number | null,
  perforation: '',
  topic: '',
  features: ''
})

const imageFile = ref<File | null>(null)

onMounted(async () => {
  await collectionStore.fetchCollectionById(collectionId)
  const collection = collectionStore.getCollection
  if (!collection || collection.collector_id != authStore.user?.id) {
    alert('У вас нет доступа к этой странице')
    router.push('/')
  }
})

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    imageFile.value = target.files[0]
  }
}

async function submitForm() {
  if (!authStore.user) {
    alert('Требуется авторизация')
    router.push('/login')
    return
  }
  if (!imageFile.value) {
    alert('Пожалуйста, выберите изображение')
    return
  }
  try {
    await stampStore.createStamp(collectionId, form, imageFile.value)
    alert('Марка успешно создана')
    router.push(`/collections/${collectionId}`)
  } catch (error) {
  }
}
</script>
