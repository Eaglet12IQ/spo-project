<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useCollectionStore } from '../stores/collectionStore'
import { useStampStore } from '../stores/stampStore'
import CollectionCard from '../components/CollectionCard.vue'
import StampCard from '../components/StampCard.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const collectionStore = useCollectionStore()
const stampStore = useStampStore()

const loading = ref(true)
const activeTab = ref('collections')

import type { Ref } from 'vue'

interface UserProfile {
  id: string
  username: string
  email: string
  name: string
  avatar: string
  bio: string
  location: string
  memberSince: string
  collectionCount: number
  stampCount: number
  following: number
  followers: number
}

const user: Ref<UserProfile | null> = ref(null)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const userCollections = computed(() => {
  if (!user.value) return []
  return collectionStore.getUserCollections(user.value.id)
})

const userStamps = computed(() => {
  return stampStore.stamps.slice(0, 4)
})

const setTab = (tab: string) => {
  activeTab.value = tab
}

const fetchProfile = async (collectorId: string) => {
  loading.value = true
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/profiles/${collectorId}`)
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

watch(() => route.params.collector_id, (newId) => {
  if (newId) {
    fetchProfile(newId as string)
  }
}, { immediate: true })

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  
  if (route.params.collector_id) {
    fetchProfile(route.params.collector_id as string)
  } else {
    user.value = authStore.user
    loading.value = false
  }
})
</script>

<template>
  <div v-if="isAuthenticated" class="profile-page min-h-screen">
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
      
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center md:items-end">
          <div class="flex-shrink-0">
            <img 
              :src="user?.avatar" 
              :alt="user?.name" 
              class="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
              v-motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :enter="{ opacity: 1, scale: 1, transition: { duration: 600, delay: 200 } }"
            />
          </div>
          <div class="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
            <h1 
              class="text-3xl font-bold text-white font-serif"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
            >
              {{ user?.name }}
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
                {{ user?.location }}
              </span>
              <span class="mx-2 text-primary-400">•</span>
              <span>Member since {{ new Date(user?.memberSince || '').toLocaleDateString() }}</span>
            </div>
          </div>
          <div class="mt-6 md:mt-0 md:ml-auto">
            <button class="btn-secondary flex items-center">
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
        <!-- Stats cards -->
        <div 
          class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        >
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-primary-500 truncate">Total Collections</dt>
              <dd class="mt-1 text-3xl font-semibold text-primary-900">{{ user?.collectionCount }}</dd>
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-primary-500 truncate">Total Stamps</dt>
              <dd class="mt-1 text-3xl font-semibold text-primary-900">{{ user?.stampCount }}</dd>
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-primary-500 truncate">Social Network</dt>
              <dd class="mt-1 flex justify-center">
                <span class="text-3xl font-semibold text-primary-900 mr-2">{{ user?.following }}</span>
                <span class="text-sm text-primary-600 self-end mb-1">Following</span>
                <span class="mx-2 text-primary-300 self-end mb-1">•</span>
                <span class="text-3xl font-semibold text-primary-900 mr-2">{{ user?.followers }}</span>
                <span class="text-sm text-primary-600 self-end mb-1">Followers</span>
              </dd>
            </div>
          </div>
        </div>
        
        <!-- Bio -->
        <div 
          class="bg-white shadow overflow-hidden rounded-lg mb-8"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
        >
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-primary-900">About</h3>
            <p class="mt-2 text-primary-600">{{ user?.bio }}</p>
          </div>
        </div>
        
        <!-- Tabs -->
        <div 
          class="border-b border-gray-200"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
        >
          <nav class="-mb-px flex">
            <button 
              @click="setTab('collections')" 
              class="py-4 px-6 border-b-2 font-medium text-sm focus:outline-none"
              :class="activeTab === 'collections' ? 'border-primary-500 text-primary-800' : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'"
            >
              Collections
            </button>
            <button 
              @click="setTab('stamps')" 
              class="py-4 px-6 border-b-2 font-medium text-sm focus:outline-none"
              :class="activeTab === 'stamps' ? 'border-primary-500 text-primary-800' : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'"
            >
              Stamps
            </button>
            <button 
              @click="setTab('activity')" 
              class="py-4 px-6 border-b-2 font-medium text-sm focus:outline-none"
              :class="activeTab === 'activity' ? 'border-primary-500 text-primary-800' : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'"
            >
              Activity
            </button>
            <button 
              @click="setTab('wishlist')" 
              class="py-4 px-6 border-b-2 font-medium text-sm focus:outline-none"
              :class="activeTab === 'wishlist' ? 'border-primary-500 text-primary-800' : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'"
            >
              Wishlist
            </button>
          </nav>
        </div>
        
        <!-- Tab content -->
        <div class="mt-8 mb-16">
          <!-- Collections tab -->
          <div v-if="activeTab === 'collections'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-primary-900 font-serif">My Collections</h2>
              <button class="btn-primary flex items-center">
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
              <p class="mt-1 text-primary-500">Get started by creating your first collection.</p>
              <div class="mt-6">
                <button class="btn-primary">Create a collection</button>
              </div>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CollectionCard 
                v-for="collection in userCollections" 
                :key="collection.id" 
                :collection="collection" 
              />
            </div>
          </div>
          
          <!-- Stamps tab -->
          <div v-if="activeTab === 'stamps'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-primary-900 font-serif">My Stamps</h2>
              <button class="btn-primary flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
                </svg>
                Add Stamp
              </button>
            </div>
            
            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <div v-for="i in 4" :key="i" class="flex flex-col rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div class="h-64 w-full bg-gray-300"></div>
                <div class="p-4 bg-white">
                  <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                </div>
              </div>
            </div>
            
            <div v-else-if="userStamps.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <h3 class="mt-2 text-lg font-medium text-primary-900">No stamps yet</h3>
              <p class="mt-1 text-primary-500">Start adding stamps to your collection.</p>
              <div class="mt-6">
                <button class="btn-primary">Add a stamp</button>
              </div>
            </div>
            
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <StampCard 
                v-for="stamp in userStamps" 
                :key="stamp.id" 
                :stamp="stamp" 
              />
            </div>
          </div>
          
          <!-- Activity tab -->
          <div v-if="activeTab === 'activity'">
            <h2 class="text-2xl font-bold text-primary-900 mb-6 font-serif">Recent Activity</h2>
            
            <div v-if="loading" class="space-y-4">
              <div v-for="i in 5" :key="i" class="bg-white shadow rounded-lg p-4 animate-pulse">
                <div class="flex">
                  <div class="h-10 w-10 rounded-full bg-gray-300"></div>
                  <div class="ml-3 flex-1">
                    <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="space-y-4">
              <div class="bg-white shadow rounded-lg p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <img class="h-10 w-10 rounded-full" :src="user?.avatar" alt="">
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-primary-900">
                      You added <span class="font-semibold">Penny Black</span> to your collection
                    </p>
                    <p class="text-sm text-primary-500">2 days ago</p>
                  </div>
                </div>
              </div>
              <div class="bg-white shadow rounded-lg p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <img class="h-10 w-10 rounded-full" :src="user?.avatar" alt="">
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-primary-900">
                      You created a new collection <span class="font-semibold">British Classics</span>
                    </p>
                    <p class="text-sm text-primary-500">5 days ago</p>
                  </div>
                </div>
              </div>
              <div class="bg-white shadow rounded-lg p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <img class="h-10 w-10 rounded-full" src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="">
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-primary-900">
                      <span class="font-semibold">Emily Johnson</span> started following you
                    </p>
                    <p class="text-sm text-primary-500">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Wishlist tab -->
          <div v-if="activeTab === 'wishlist'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-primary-900 font-serif">Wishlist</h2>
              <button class="btn-primary flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
                </svg>
                Add to Wishlist
              </button>
            </div>
            
            <div class="text-center py-12 bg-white rounded-lg shadow">
              <svg class="mx-auto h-12 w-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <h3 class="mt-2 text-lg font-medium text-primary-900">Your wishlist is empty</h3>
              <p class="mt-1 text-primary-500">Add stamps you're looking for to your wishlist.</p>
              <div class="mt-6">
                <button class="btn-primary">Browse stamps</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>