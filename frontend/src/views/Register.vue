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
    error.value = 'Please fill in all fields'
    return false
  }
  
  if (userData.password !== userData.confirmPassword) {
    error.value = 'Passwords do not match'
    return false
  }
  
  if (!userData.agreeTerms) {
    error.value = 'You must agree to the terms and conditions'
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
    
    router.push('/')
  } catch (err) {
    error.value = 'Registration failed. Please try again.'
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
        Join PhilateList
      </h2>
      <p class="mt-2 text-center text-sm text-primary-600">
        Start your stamp collecting journey today
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
              Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                type="text"
                v-model="userData.username"
                required
                class="input-field"
                placeholder="johndoe"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-primary-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                type="email"
                v-model="userData.email"
                required
                class="input-field"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-primary-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                type="password"
                v-model="userData.password"
                required
                class="input-field"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-primary-700">
              Confirm password
            </label>
            <div class="mt-1">
              <input
                id="confirm-password"
                type="password"
                v-model="userData.confirmPassword"
                required
                class="input-field"
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
              I agree to the
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                Terms and Conditions
              </a>
              and
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                Privacy Policy
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
              {{ loading ? 'Creating your account...' : 'Create account' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-primary-500">
                Or continue with
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-3 gap-3">
            <div>
              <a
                href="#"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-primary-500 hover:bg-gray-50"
              >
                <span class="sr-only">Register with Facebook</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>

            <div>
              <a
                href="#"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-primary-500 hover:bg-gray-50"
              >
                <span class="sr-only">Register with Twitter</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                  />
                </svg>
              </a>
            </div>

            <div>
              <a
                href="#"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-primary-500 hover:bg-gray-50"
              >
                <span class="sr-only">Register with Google</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div class="mt-6 text-center text-sm">
          <p class="text-primary-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-primary-700 hover:text-primary-800">
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>