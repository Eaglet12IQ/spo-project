<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const credentials = reactive({
  identifier: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!credentials.identifier || !credentials.password) {
    error.value = 'Please fill in all fields'
    return
  }
  
  try {
    loading.value = true
    error.value = ''
    
    await authStore.login(credentials.identifier, credentials.password)
    router.push(`/profiles/${authStore.user?.id}`)
  } catch (err) {
    error.value = 'Неверный логин или пароль!'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div 
    class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    v-motion
    :initial="{ opacity: 0 }"
    :enter="{ opacity: 1, transition: { duration: 800 } }"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-primary-900 font-serif">
        С возвращением
      </h2>
      <p class="mt-2 text-center text-sm text-primary-600">
        Войдите в систему, чтобы получить доступ к своей коллекции
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div 
        class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 } }"
      >
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="identifier" class="block text-sm font-medium text-primary-7 q00">
              Имя пользователя или электронная почта
            </label>
            <div class="mt-1">
              <input
                id="identifier"
                type="text"
                v-model="credentials.identifier"
                required
                class="w-full p-2 border-2"
                placeholder="Имя пользователя или электронная почта"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-primary-700">
              Пароль
            </label>
            <div class="mt-1">
              <input
                id="password"
                type="password"
                v-model="credentials.password"
                required
                class="w-full p-2 border-2"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div v-if="error" class="text-accent-700 text-sm text-center" role="alert">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full btn-primary flex justify-center py-2 px-4"
            >
              <svg 
                v-if="loading" 
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  class="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  stroke-width="4"
                ></circle>
                <path 
                  class="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ loading ? 'Вход в систему...' : 'Войти' }}
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center text-sm">
          <p class="text-primary-600">
            У вас нет учетной записи?
            <router-link to="/register" class="font-medium text-primary-700 hover:text-primary-800">
              Зарегистрируйтесь
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
