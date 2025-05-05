<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStampStore } from '../stores/stampStore'
import { useCollectionStore } from '../stores/collectionStore'
import { useCollectorStore } from '../stores/collectorStore'
import StampCard from '../components/StampCard.vue'
import CollectionCard from '../components/CollectionCard.vue'
import CollectorCard from '../components/CollectorCard.vue'

const router = useRouter()
const stampStore = useStampStore()
const collectionStore = useCollectionStore()
const collectorStore = useCollectorStore()

const loading = ref(true)

const featuredStamps = ref(stampStore.stamps.slice(0, 3))
const featuredCollections = ref(collectionStore.featuredCollections)
const featuredCollectors = ref(collectorStore.featuredCollectors)

const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/stamps',
      query: { search: searchQuery.value }
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 600)
})
</script>

<template>
  <div class="home-page">
    <!-- Hero section -->
    <div 
      class="relative bg-primary-900 text-white overflow-hidden"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { duration: 800 } }"
    >
      <div class="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/7267684/pexels-photo-7267684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Stamp collection background"
          class="w-full h-full object-cover opacity-10"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="py-24 lg:py-32">
          <h1 
            class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-serif"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
          >
            PhilateList
          </h1>
          <p 
            class="mt-6 text-xl max-w-3xl"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
          >
            The premier platform for stamp collectors and philatelists. Discover, organize, and connect with fellow enthusiasts around the world.
          </p>
          
          <div 
            class="mt-10"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 600 } }"
          >
            <form @submit.prevent="handleSearch" class="sm:flex">
              <div class="min-w-0 flex-1">
                <label for="search" class="sr-only">Search stamps</label>
                <input 
                  id="search" 
                  type="text" 
                  v-model="searchQuery"
                  placeholder="Search for stamps, collections, or collectors..."
                  class="block w-full px-4 py-3 rounded-md border-0 text-base text-primary-900 placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-3">
                <button type="submit" class="block w-full bg-primary-500 py-3 px-4 rounded-md text-white font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Featured stamps section -->
    <section class="py-12 sm:py-16 bg-primary-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-primary-900 font-serif">Featured Stamps</h2>
          <p class="mt-3 max-w-2xl mx-auto text-lg text-primary-600">
            Discover unique and valuable stamps from collectors around the world.
          </p>
        </div>
        
        <div class="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
          <div v-if="loading" v-for="i in 3" :key="i" class="flex flex-col rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div class="flex-shrink-0">
              <div class="h-48 w-full bg-gray-300"></div>
            </div>
            <div class="flex-1 bg-white p-6 flex flex-col justify-between">
              <div class="flex-1">
                <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div class="h-3 bg-gray-300 rounded w-full"></div>
                <div class="h-3 bg-gray-300 rounded w-full mt-1"></div>
              </div>
            </div>
          </div>
          
          <template v-else>
            <StampCard 
              v-for="stamp in featuredStamps" 
              :key="stamp.id" 
              :stamp="stamp" 
            />
          </template>
        </div>
        
        <div class="mt-12 text-center">
          <router-link to="/stamps" class="btn-secondary">
            View all stamps
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- Featured collections section -->
    <section class="py-12 sm:py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-primary-900 font-serif">Curated Collections</h2>
          <p class="mt-3 max-w-2xl mx-auto text-lg text-primary-600">
            Explore themed collections curated by passionate philatelists.
          </p>
        </div>
        
        <div class="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-2 lg:max-w-none">
          <div v-if="loading" v-for="i in 2" :key="i" class="flex flex-col rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div class="flex-shrink-0">
              <div class="h-48 w-full bg-gray-300"></div>
            </div>
            <div class="flex-1 bg-white p-6 flex flex-col justify-between">
              <div class="flex-1">
                <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div class="h-3 bg-gray-300 rounded w-full"></div>
                <div class="h-3 bg-gray-300 rounded w-full mt-1"></div>
              </div>
            </div>
          </div>
          
          <template v-else>
            <CollectionCard 
              v-for="collection in featuredCollections" 
              :key="collection.id" 
              :collection="collection" 
            />
          </template>
        </div>
        
        <div class="mt-12 text-center">
          <router-link to="/collections" class="btn-secondary">
            View all collections
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- Featured collectors section -->
    <section class="py-12 sm:py-16 bg-primary-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-primary-900 font-serif">Notable Collectors</h2>
          <p class="mt-3 max-w-2xl mx-auto text-lg text-primary-600">
            Connect with renowned philatelists and stamp collecting experts.
          </p>
        </div>
        
        <div class="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-2 lg:max-w-none">
          <div v-if="loading" v-for="i in 2" :key="i" class="flex flex-col rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div class="flex-1 bg-white p-6 flex flex-col justify-between">
              <div class="flex">
                <div class="h-16 w-16 rounded-full bg-gray-300"></div>
                <div class="ml-4 flex-1">
                  <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div class="mt-4">
                <div class="h-3 bg-gray-300 rounded w-full"></div>
                <div class="h-3 bg-gray-300 rounded w-full mt-1"></div>
              </div>
            </div>
          </div>
          
          <template v-else>
            <CollectorCard 
              v-for="collector in featuredCollectors" 
              :key="collector.id" 
              :collector="collector" 
            />
          </template>
        </div>
        
        <div class="mt-12 text-center">
          <router-link to="/collectors" class="btn-secondary">
            View all collectors
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
