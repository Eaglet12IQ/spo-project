<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useCollectionStore } from '../stores/collectionStore'
import { useStampStore } from '../stores/stampStore'
import CollectionCard from '../components/CollectionCard.vue'
import StampCard from '../components/StampCard.vue'
import {Profile} from '../types.ts'
import { fetchWithTokenCheck } from '../utils/http'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const collectionStore = useCollectionStore()
const stampStore = useStampStore()

const goToAccountSettings = () => {
  if (user.value?.id) {
    router.push(`/settings`)
  }
}

const loading = ref(true)
const activeTab = ref('collections')

import type { Ref } from 'vue'

const user: Ref<Profile | null> = ref(null)

const isOwnProfile = computed(() => {
  return user.value?.id === authStore.user?.id
})

const userCollections = computed(() => {
  return user.value?.collections || []
})

// New ref for file input element
const fileInputRef = ref<HTMLInputElement | null>(null)

// Method to trigger file input click
const onAvatarClick = () => {
  if (isOwnProfile.value && fileInputRef.value) {
    fileInputRef.value.click()
  }
}

// Method to handle file selection and upload
const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  const formData = new FormData()
  formData.append('file', file)

  try {
    const token = localStorage.getItem('access_token')
    const response = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/settings/avatar`, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include' // send cookies if needed for auth
    })
    if (!response.ok) {
      throw new Error('Failed to upload avatar')
    }
    const data = await response.json()
    // Assuming the response contains the new avatar URL in data.avatar_url
    if (data.avatar_url && user.value) {
      user.value = {
        ...user.value,
        avatar_url: `${data.avatar_url}?t=${Date.now()}` // 👈 добавляем временной параметр
      }
    }
  } catch (error) {
    console.error(error)
    alert('Error uploading avatar')
  }
}

const fetchProfile = async (collectorId: string) => {
  loading.value = true
  try {
    const response = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/profiles/${collectorId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }
    const data = await response.json()
    user.value = data
  } catch (error) {
    console.error(error)
    router.push('/notfound')
  } finally {
    loading.value = false
  }
}

const goToCreateCollection = () => {
  router.push('/collections/create')
}

watch(() => route.params.collector_id, (newId) => {
  if (newId) {
    fetchProfile(newId as string)
  }
}, { immediate: true })
</script>

<template>
  <div class="profile-page min-h-screen">
    <div 
      class="relative bg-primary-900 pb-32"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { duration: 800 } }"
    >
      <div class="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/19102326/pexels-photo-19102326/free-photo-of-vintage-envelopes-and-stamps.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Profile background"
          class="w-full h-full object-cover opacity-10"
        />
      </div>
      
      <div class="relative max-w-7xl mx-auto pt-12 pb-0 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center md:items-end">
          <div class="flex-shrink-0">
            <img 
              :src="user?.avatar_url" 
              :alt="user?.last_name" 
              :key="user?.avatar_url"
              class="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg cursor-pointer"
              v-motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :enter="{ opacity: 1, scale: 1, transition: { duration: 600, delay: 200 } }"
              @click="onAvatarClick"
            />
            <input 
              type="file" 
              accept="image/*" 
              ref="fileInputRef" 
              class="hidden" 
              @change="onFileChange"
            />
          </div>
          <div class="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
            <h1 
              class="text-3xl font-bold text-white font-serif"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
            >
              {{ user && user.last_name && user.first_name && user.middle_name 
              ? user.last_name + " " + user.first_name[0] + "." + " " + user.middle_name[0] + "." 
              : "Аноним" }}
            </h1>
            <p 
              class="text-primary-100 text-lg"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 600 } }"
            >
              @{{ user?.username }}
            </p>
            <div 
              class="mt-2 flex flex-wrap items-center justify-center md:justify-start text-primary-100"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 800 } }"
            >
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
                {{ user && user.country 
                ? user.country
                : "Неизвестно" }}
              </span>
            </div>
          </div>
          <div class="mt-6 md:mt-0 md:ml-auto">
            <button class="btn-secondary flex items-center" v-if="isOwnProfile" @click="goToAccountSettings">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Profile body with stats and tabs -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="-mt-16 relative z-10">
        
        <!-- Tab content -->
          <!-- Collections tab -->
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-white font-serif">Collections</h2>
              <button class="btn-primary flex items-center" v-if="isOwnProfile" @click="goToCreateCollection">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
                </svg>
                New Collection
              </button>
            </div>
            
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div v-for="i in 2" :key="i" class="flex flex-col rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div class="h-48 w-full bg-gray-300"></div>
                <div class="p-6 bg-white">
                  <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div class="h-3 bg-gray-300 rounded w-full"></div>
                  <div class="h-3 bg-gray-300 rounded w-full mt-1"></div>
                </div>
              </div>
            </div>
            
            <div v-else-if="userCollections.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h3 class="mt-2 text-lg font-medium text-primary-900">No collections yet</h3>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <CollectionCard 
                v-for="collection in userCollections" 
                :key="collection.id" 
                :collection="collection" 
              />
            </div>
      </div>
    </div>
  </div>
</template>
