<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStampStore } from '../stores/stampStore'
import { useAuthStore } from '../stores/authStore'
import type { Stamp } from '../types'

const route = useRoute()
const router = useRouter()
const stampStore = useStampStore()
const authStore = useAuthStore()

const stampId = computed(() => route.params.id as string)
const stamp = ref<Stamp | null>(null)
const loading = ref(true)
const error = ref('')

const isOwner = computed(() => {
  return stamp.value?.collector_id == authStore.user?.id
})

const name = ref('')
const serialNumber = ref('')
const country = ref('')
const year = ref<number | null>(null)
const circulation = ref<number | null>(null)
const cost = ref<number | null>(null)
const perforation = ref('')
const topic = ref('')
const features = ref('')
const imageFile = ref<File | null>(null)

async function fetchStamp() {
  loading.value = true
  error.value = ''
  try {
    const fetchedStamp = await stampStore.fetchStampById(stampId.value)
    if (!fetchedStamp) {
      error.value = 'Stamp not found'
      return
    }
    stamp.value = fetchedStamp
    name.value = stamp.value.name || ''
    serialNumber.value = stamp.value.serial_number || ''
    country.value = stamp.value.country || ''
    year.value = stamp.value.year || null
    circulation.value = stamp.value.circulation || null
    cost.value = stamp.value.cost || null
    perforation.value = stamp.value.perforation || ''
    topic.value = stamp.value.topic || ''
    features.value = stamp.value.features || ''
  } catch (err) {
    error.value = 'Failed to load stamp'
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

async function saveStamp() {
  if (!stamp.value) return
  error.value = ''
  try {
    await stampStore.updateStamp(Number(stamp.value?.id), {
      name: name.value,
      serial_number: serialNumber.value,
      country: country.value,
      year: year.value || 0,
      circulation: circulation.value || 0,
      cost: cost.value || 0,
      perforation: perforation.value,
      topic: topic.value,
      features: features.value,
      imageFile: imageFile.value
    })
    error.value = ''
    // Use vue-router to navigate to stamp detail page
    window.location.href = `/stamps/${stamp.value?.id}`
  } catch (err: any) {
    console.error('Save error:', err)
    if (err.response?.data?.detail) {
      error.value = `Ошибка: ${err.response.data.detail}`
    } else {
      error.value = 'Не удалось сохранить марку'
    }
  }
}

onMounted(() => {
  fetchStamp()
})
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-4">Редактировать марку</h1>
    <div v-if="loading">Загрузка...</div>
    <div v-else>
      <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>
      <div v-else>
        <div v-if="!isOwner" class="text-red-600">
          У вас нет прав для редактирования этой марки.
        </div>
        <form v-else @submit.prevent="saveStamp" class="space-y-4">
          <div>
            <label class="block font-medium mb-1" for="name">Название</label>
            <input id="name" v-model="name" type="text" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1" for="serialNumber">Серийный номер</label>
            <input id="serialNumber" v-model="serialNumber" type="text" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1" for="country">Страна</label>
            <input id="country" v-model="country" type="text" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1" for="year">Год</label>
            <input id="year" v-model.number="year" type="number" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1" for="circulation">Тираж</label>
            <input id="circulation" v-model.number="circulation" type="number" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1" for="cost">Стоимость</label>
            <input id="cost" v-model.number="cost" type="number" step="0.01" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1" for="perforation">Зубцовка</label>
            <input id="perforation" v-model="perforation" type="text" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1" for="topic">Тема</label>
            <input id="topic" v-model="topic" type="text" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1" for="features">Особенности</label>
            <textarea id="features" v-model="features" rows="3" class="w-full border rounded px-3 py-2"></textarea>
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
