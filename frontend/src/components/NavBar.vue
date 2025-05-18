<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isMenuOpen = ref(false)
const isUserMenuOpen = ref(false)

const isLoggedIn = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

function closeMenus() {
  isMenuOpen.value = false
  isUserMenuOpen.value = false
}

async function logout() {
  await authStore.logout()
  closeMenus()
  router.push('/login')
}

function navigateTo(route: string) {
  closeMenus()
  router.push(route)
}
</script>

<template>
  <nav class="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and main navigation -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center" @click="closeMenus">
              <span class="text-2xl font-serif font-bold text-primary-800">PhilateList</span>
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link 
              to="/" 
              class="border-transparent text-primary-700 hover:text-primary-900 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-primary-500': $route.path === '/' }"
            >
              Главная
            </router-link>
            <router-link 
              to="/stamps" 
              class="border-transparent text-primary-700 hover:text-primary-900 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-primary-500': $route.path === '/stamps' }"
            >
              Марки
            </router-link>
            <router-link 
              to="/collections" 
              class="border-transparent text-primary-700 hover:text-primary-900 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-primary-500': $route.path === '/collections' }"
            >
              Коллекции
            </router-link>
            <router-link 
              to="/collectors" 
              class="border-transparent text-primary-700 hover:text-primary-900 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-primary-500': $route.path === '/collectors' }"
            >
              Коллекционеры
            </router-link>
          </div>
        </div>
        
        <!-- User section -->
        <div class="flex items-center">
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <!-- Not logged in -->
            <template v-if="!isLoggedIn">
              <router-link to="/login" class="text-primary-700 hover:text-primary-900 px-3 py-2 text-sm font-medium">
                Вход
              </router-link>
              <router-link to="/register" class="btn-primary ml-3">
                Регистрация
              </router-link>
            </template>
            
            <!-- Logged in -->
            <template v-else>
              <div class="ml-3 relative">
                <div>
<button 
  @click="toggleUserMenu" 
  class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
>
  {{ user?.username }}
</button>
                </div>
                
                <div 
                  v-if="isUserMenuOpen" 
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  v-motion
                  :initial="{ opacity: 0, y: -10 }"
                  :enter="{ opacity: 1, y: 0, transition: { duration: 300 } }"
                >
<router-link :to="`/profiles/${user?.id}`" class="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-100" @click="closeMenus">
  Профиль
</router-link>
                  <a href="#" class="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-100" @click="logout">
                    Выход
                  </a>
                </div>
              </div>
            </template>
          </div>
          
          <!-- Mobile menu button -->
          <div class="flex items-center sm:hidden">
            <button 
              @click="toggleMenu" 
              class="inline-flex items-center justify-center p-2 rounded-md text-primary-700 hover:text-primary-900 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <svg 
                class="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path 
                  v-if="!isMenuOpen" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
                <path 
                  v-else 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-if="isMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1"
        v-motion
        :initial="{ opacity: 0, height: 0 }"
        :enter="{ opacity: 1, height: 'auto', transition: { duration: 300 } }"
      >
        <router-link 
          to="/" 
          class="text-primary-700 hover:bg-primary-50 hover:text-primary-900 block pl-3 pr-4 py-2 text-base font-medium border-l-4"
          :class="$route.path === '/' ? 'border-primary-500 bg-primary-50' : 'border-transparent'"
          @click="closeMenus"
        >
          Главная
        </router-link>
        <router-link 
          to="/stamps" 
          class="text-primary-700 hover:bg-primary-50 hover:text-primary-900 block pl-3 pr-4 py-2 text-base font-medium border-l-4"
          :class="$route.path === '/stamps' ? 'border-primary-500 bg-primary-50' : 'border-transparent'"
          @click="closeMenus"
        >
          Марки
        </router-link>
        <router-link 
          to="/collections" 
          class="text-primary-700 hover:bg-primary-50 hover:text-primary-900 block pl-3 pr-4 py-2 text-base font-medium border-l-4"
          :class="$route.path === '/collections' ? 'border-primary-500 bg-primary-50' : 'border-transparent'"
          @click="closeMenus"
        >
          Коллекции
        </router-link>
        <router-link 
          to="/collectors" 
          class="text-primary-700 hover:bg-primary-50 hover:text-primary-900 block pl-3 pr-4 py-2 text-base font-medium border-l-4"
          :class="$route.path === '/collectors' ? 'border-primary-500 bg-primary-50' : 'border-transparent'"
          @click="closeMenus"
        >
          Коллекционеры
        </router-link>
      </div>
      
      <!-- Mobile user menu -->
      <div class="pt-4 pb-3 border-t border-gray-200">
        <template v-if="isLoggedIn">
          <div class="flex items-center px-4">
            <div class="ml-3">
              <div class="text-base font-medium text-primary-800">{{ user?.username }}</div>
              <div class="text-sm font-medium text-primary-500">{{ user?.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <router-link 
              to="/profile" 
              class="block px-4 py-2 text-base font-medium text-primary-700 hover:text-primary-900 hover:bg-primary-50"
              @click="closeMenus"
            >
              Профиль
            </router-link>
            <a 
              href="#" 
              class="block px-4 py-2 text-base font-medium text-primary-700 hover:text-primary-900 hover:bg-primary-50"
              @click="logout"
            >
              Выход
            </a>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col space-y-2 px-4">
            <router-link 
              to="/login" 
              class="w-full text-center text-primary-700 hover:text-primary-900 px-3 py-2 text-base font-medium border border-primary-300 rounded-md"
              @click="closeMenus"
            >
              Вход
            </router-link>
            <router-link 
              to="/register" 
              class="w-full text-center bg-primary-700 hover:bg-primary-800 text-white px-3 py-2 text-base font-medium rounded-md"
              @click="closeMenus"
            >
              Регистрация
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>