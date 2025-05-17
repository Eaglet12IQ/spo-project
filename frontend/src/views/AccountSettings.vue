<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import type { User_settings, Profile, Collector } from '../types'
import { fetchWithTokenCheck } from '../utils/http'

const router = useRouter()
const authStore = useAuthStore()

const user = reactive<User_settings>({
  username: '',
  email: ''
})

const collector = reactive<Collector>({
  country: '', 
  phone_number: '',
  first_name: '',
  last_name: '',
  middle_name: ''
})

const loading = ref(true)
const error = ref('')

const fetchProfileData = async () => {
  loading.value = true
  error.value = ''
  try {
    // Fetch user data
    const token = localStorage.getItem('access_token')
    const userResponse = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/settings/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'  // ⬅️ ОБЯЗАТЕЛЬНО
    })
    if (!userResponse.ok) throw new Error('Failed to fetch user data')
    const userData = await userResponse.json()
    Object.assign(user, userData)

    // Fetch collector data
    const collectorResponse = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/settings/collector`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'  // ⬅️ ОБЯЗАТЕЛЬНО
    })
    if (!collectorResponse.ok) throw new Error('Failed to fetch collector data')
    const collectorData = await collectorResponse.json()
    Object.assign(collector, collectorData)
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfileData()
})

const specialtiesInput = ref('')

const updateProfile = async () => {
  error.value = ''
  try {
    // Update user data
    const userUpdateResponse = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/users/${authStore.user?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    if (!userUpdateResponse.ok) throw new Error('Failed to update user data')

    const collectorUpdateResponse = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/collectors/${authStore.user?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collector)
    })
    if (!collectorUpdateResponse.ok) throw new Error('Failed to update collector data')

    alert('Profile updated successfully')
    router.push(`/profiles/${authStore.user?.id}`)
  } catch (err) {
    error.value = (err as Error).message
  }
}

const deleteAccount = async () => {
  if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) {
    return
  }
  error.value = ''
  try {
    const token = localStorage.getItem('access_token')
    const response = await fetchWithTokenCheck('http://127.0.0.1:8000/api/auth/delete', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Ошибка при удалении аккаунта')
    }
    alert('Аккаунт успешно удален')
    authStore.user = null
    localStorage.removeItem('access_token')
    router.push('/register')
  } catch (err) {
    error.value = (err as Error).message
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Настройки</h1>

    <div v-if="loading" class="text-center">Загрузка...</div>
    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <form v-if="!loading" @submit.prevent="updateProfile" class="space-y-4">
      <fieldset>
        <label class="block mb-1">
          Имя пользователя:
          <input v-model="user.username" type="text" class="input" required />
        </label>
        <label class="block mb-1">
          Электронная почта:
          <input v-model="user.email" type="email" class="input" required />
        </label>
      </fieldset>

      <fieldset>
        <label class="block mb-1">
          Фамилия:
          <input v-model="collector.last_name" type="text" class="input" />
        </label>
        <label class="block mb-1">
          Имя:
          <input v-model="collector.first_name" class="input"></input>
        </label>
        <label class="block mb-1">
          Отчество:
          <input v-model="collector.middle_name" type="text" class="input" />
        </label>
        <label class="block mb-1">
          Страна:
        <input v-model="collector.country" type="text" class="input" />
        </label>
        <label class="block mb-1">
          Номер телефона:
        <input v-model="collector.phone_number" type="text" class="input" />
        </label>
      </fieldset>

      <button type="submit" class="btn-primary">Сохранить настройки</button>
    </form>

    <button @click="deleteAccount" class="btn-danger mt-6">Удалить аккаунт</button>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-danger:hover {
  background-color: #b91c1c;
}
</style>
