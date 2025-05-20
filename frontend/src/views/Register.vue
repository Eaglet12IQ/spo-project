<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const userData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const loading = ref(false)
const error = ref('')

const validateForm = () => {
  if (!userData.username || !userData.email || !userData.password || !userData.confirmPassword) {
    error.value = 'Пожалуйста, заполните все поля!'
    return false
  }
  
  if (userData.password !== userData.confirmPassword) {
    error.value = 'Пароли не совпадают!'
    return false
  }
  
  if (!userData.agreeTerms) {
    error.value = 'Вы должны согласиться с правилами и условиями!'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    error.value = ''
    
    await authStore.register({
      username: userData.username,
      email: userData.email,
      password: userData.password
    })
    
    router.push(`/profiles/${authStore.user?.id}`)
  } catch (err) {
    error.value = 'Регистрация не удалась! Пожалуйста, попробуйте еще раз!'
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
        Присоединяйтесь к PhilateList
      </h2>
      <p class="mt-2 text-center text-sm text-primary-600">
        Начните свое путешествие по коллекционированию марок
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
            <label for="username" class="block text-sm font-medium text-primary-700">
              Имя пользователя
            </label>
            <div class="mt-1">
              <input
                id="username"
                type="text"
                v-model="userData.username"
                required
                class="w-full p-2 border-2"
                placeholder="johndoe"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-primary-700">
              Электронная почта
            </label>
            <div class="mt-1">
              <input
                id="email"
                type="email"
                v-model="userData.email"
                required
                class="w-full p-2 border-2"
                placeholder="you@example.com"
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
                v-model="userData.password"
                required
                class="w-full p-2 border-2"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-primary-700">
              Подтверждение пароля
            </label>
            <div class="mt-1">
              <input
                id="confirm-password"
                type="password"
                v-model="userData.confirmPassword"
                required
                class="w-full p-2 border-2"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="agree-terms"
              type="checkbox"
              v-model="userData.agreeTerms"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="agree-terms" class="ml-2 block text-sm text-primary-700">
              Я согласен на
              <a class="font-medium text-primary-600 hover:text-primary-500">
                Обработку персональных данных
              </a>
            </label>
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
              {{ loading ? 'Создание учетной записи...' : 'Создать учетную запись' }}
            </button>
          </div>
        </form>


        <div class="mt-6 text-center text-sm">
          <p class="text-primary-600">
            У вас уже есть учетная запись?
            <router-link to="/login" class="font-medium text-primary-700 hover:text-primary-800">
              Войти
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>