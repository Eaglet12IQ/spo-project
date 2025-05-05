<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStampStore } from '../stores/stampStore'
import StampCard from '../components/StampCard.vue'
import gsap from 'gsap'

const route = useRoute()
const router = useRouter()
const stampStore = useStampStore()

const stampId = computed(() => route.params.id as string)
const stamp = computed(() => stampStore.getStampById(stampId.value))
const relatedStamps = computed(() => stampStore.getRelatedStamps(stampId.value))

const loading = ref(true)
const zoomLevel = ref(1)
const rotation = ref(0)
const showLightbox = ref(false)

// Canvas magnifier
const canvasRef = ref<HTMLCanvasElement | null>(null)
const magnifierActive = ref(false)
const magnifierPos = ref({ x: 0, y: 0 })
const magnifierSize = 150
const magnificationLevel = 2.5

function handleMagnifier(event: MouseEvent) {
  if (!canvasRef.value || !stamp.value) return
  
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  
  magnifierPos.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
  
  drawMagnifier()
}

function drawMagnifier() {
  if (!canvasRef.value || !magnifierActive.value || !stamp.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Load the stamp image
  const img = new Image()
  img.src = stamp.value.image
  
  img.onload = () => {
    // Set canvas dimensions to match image
    canvas.width = img.width
    canvas.height = img.height
    
    // Draw the base image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    
    // Draw the magnifier
    ctx.save()
    
    // Create a circle for the magnifier
    ctx.beginPath()
    ctx.arc(magnifierPos.value.x, magnifierPos.value.y, magnifierSize / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    
    // Clear the area inside the circle
    ctx.clearRect(
      magnifierPos.value.x - magnifierSize / 2,
      magnifierPos.value.y - magnifierSize / 2,
      magnifierSize,
      magnifierSize
    )
    
    // Draw the zoomed in image in the circle
    const zoomX = magnifierPos.value.x - (magnifierSize / 2) / magnificationLevel
    const zoomY = magnifierPos.value.y - (magnifierSize / 2) / magnificationLevel
    const zoomWidth = magnifierSize / magnificationLevel
    const zoomHeight = magnifierSize / magnificationLevel
    
    ctx.drawImage(
      img,
      zoomX,
      zoomY,
      zoomWidth,
      zoomHeight,
      magnifierPos.value.x - magnifierSize / 2,
      magnifierPos.value.y - magnifierSize / 2,
      magnifierSize,
      magnifierSize
    )
    
    // Draw a border around the magnifier
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 3
    ctx.stroke()
    
    ctx.restore()
  }
}

function toggleMagnifier() {
  magnifierActive.value = !magnifierActive.value
  if (magnifierActive.value) {
    drawMagnifier()
  } else if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx && stamp.value) {
      const img = new Image()
      img.src = stamp.value.image
      img.onload = () => {
        canvasRef.value!.width = img.width
        canvasRef.value!.height = img.height
        ctx.drawImage(img, 0, 0)
      }
    }
  }
}

function zoomIn() {
  if (zoomLevel.value < 3) {
    zoomLevel.value += 0.25
  }
}

function zoomOut() {
  if (zoomLevel.value > 1) {
    zoomLevel.value -= 0.25
  }
}

function rotateLeft() {
  rotation.value = (rotation.value - 90) % 360
}

function rotateRight() {
  rotation.value = (rotation.value + 90) % 360
}

function openLightbox() {
  showLightbox.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  showLightbox.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  if (!stamp.value) {
    router.push('/stamps')
    return
  }
  
  // Initialize canvas
  if (canvasRef.value && stamp.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      const img = new Image()
      img.src = stamp.value.image
      img.onload = () => {
        canvasRef.value!.width = img.width
        canvasRef.value!.height = img.height
        ctx.drawImage(img, 0, 0)
      }
    }
  }
  
  // Animation
  gsap.from('.stamp-detail-card', {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2
  })
  
  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>

<template>
  <div v-if="stamp" class="stamp-detail-page min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm text-primary-600">
          <li>
            <router-link to="/" class="hover:text-primary-800">Home</router-link>
          </li>
          <li class="flex items-center">
            <svg class="h-4 w-4 flex-shrink-0 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
            <router-link to="/stamps" class="ml-2 hover:text-primary-800">Stamps</router-link>
          </li>
          <li class="flex items-center">
            <svg class="h-4 w-4 flex-shrink-0 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="ml-2 text-primary-800 font-medium truncate">{{ stamp.title }}</span>
          </li>
        </ol>
      </nav>

      <div class="md:flex">
        <!-- Stamp image and controls -->
        <div class="md:w-1/2 stamp-detail-card">
          <div 
            class="stamp-frame p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto"
            :style="{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease-out'
            }"
          >
            <div 
              class="stamp-image-container relative cursor-pointer overflow-hidden"
              @click="openLightbox"
            >
              <img 
                v-if="!canvasRef" 
                :src="stamp.image" 
                :alt="stamp.title" 
                class="w-full h-auto"
              />
              <canvas 
                ref="canvasRef" 
                class="w-full h-auto"
                @mousemove="magnifierActive ? handleMagnifier($event) : null"
              ></canvas>
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 transition-all">
                <svg class="w-12 h-12 text-white opacity-0 transform scale-75 transition-all group-hover:opacity-100 group-hover:scale-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-center mt-6 space-x-4">
            <button 
              @click="zoomOut"
              class="p-2 rounded-full bg-white shadow-md text-primary-700 hover:bg-primary-50 focus:outline-none"
              :disabled="zoomLevel <= 1"
              :class="{ 'opacity-50 cursor-not-allowed': zoomLevel <= 1 }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path>
              </svg>
            </button>
            
            <button 
              @click="toggleMagnifier"
              class="p-2 rounded-full bg-white shadow-md hover:bg-primary-50 focus:outline-none"
              :class="magnifierActive ? 'text-primary-500' : 'text-primary-700'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
            </button>
            
            <button 
              @click="zoomIn"
              class="p-2 rounded-full bg-white shadow-md text-primary-700 hover:bg-primary-50 focus:outline-none"
              :disabled="zoomLevel >= 3"
              :class="{ 'opacity-50 cursor-not-allowed': zoomLevel >= 3 }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
              </svg>
            </button>
            
            <button 
              @click="rotateLeft"
              class="p-2 rounded-full bg-white shadow-md text-primary-700 hover:bg-primary-50 focus:outline-none"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            
            <button 
              @click="rotateRight"
              class="p-2 rounded-full bg-white shadow-md text-primary-700 hover:bg-primary-50 focus:outline-none"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Stamp details -->
        <div class="md:w-1/2 md:pl-12 mt-8 md:mt-0 stamp-detail-card">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h1 class="text-3xl font-bold text-primary-900 font-serif">{{ stamp.title }}</h1>
            
            <div class="mt-2 flex items-center">
              <span 
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="{
                  'bg-purple-100 text-purple-800': stamp.rarity === 'Unique',
                  'bg-red-100 text-red-800': stamp.rarity === 'Extremely High',
                  'bg-orange-100 text-orange-800': stamp.rarity === 'Very High',
                  'bg-amber-100 text-amber-800': stamp.rarity === 'High',
                  'bg-blue-100 text-blue-800': stamp.rarity === 'Medium',
                  'bg-green-100 text-green-800': stamp.rarity === 'Low',
                  'bg-gray-100 text-gray-800': !stamp.rarity
                }"
              >
                {{ stamp.rarity }}
              </span>
              <span class="mx-2 text-primary-400">•</span>
              <span class="text-primary-600">{{ stamp.country }}</span>
              <span class="mx-2 text-primary-400">•</span>
              <span class="text-primary-600">{{ stamp.year }}</span>
            </div>
            
            <div class="mt-6">
              <h2 class="text-lg font-semibold text-primary-900">Description</h2>
              <p class="mt-2 text-primary-600">{{ stamp.description }}</p>
            </div>
            
            <div class="mt-6 grid grid-cols-2 gap-4">
              <div>
                <h3 class="text-sm font-medium text-primary-500">Denomination</h3>
                <p class="text-primary-900">{{ stamp.denomination }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-primary-500">Color</h3>
                <p class="text-primary-900">{{ stamp.color }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-primary-500">Condition</h3>
                <p class="text-primary-900">{{ stamp.condition }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-primary-500">Dimensions</h3>
                <p class="text-primary-900">{{ stamp.dimensions }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-primary-500">Perforations</h3>
                <p class="text-primary-900">{{ stamp.perforations }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-primary-500">Catalog Number</h3>
                <p class="text-primary-900">{{ stamp.catalogNumber }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-primary-500">Estimated Value</h3>
                <p class="text-primary-900">${{ stamp.estimatedValue.toLocaleString() }}</p>
              </div>
            </div>
            
            <div class="mt-6">
              <h3 class="text-sm font-medium text-primary-500">Themes</h3>
              <div class="mt-2 flex flex-wrap gap-2">
                <span 
                  v-for="theme in stamp.themes" 
                  :key="theme" 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {{ theme }}
                </span>
              </div>
            </div>
            
            <div class="mt-8 flex space-x-4">
              <button class="btn-primary flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add to Collection
              </button>
              <button class="btn-secondary flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Related stamps -->
      <div class="mt-16 stamp-detail-card">
        <h2 class="text-2xl font-bold text-primary-900 mb-8 font-serif">Related Stamps</h2>
        
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="i in 4" :key="i" class="flex flex-col rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div class="h-48 w-full bg-gray-300"></div>
            <div class="p-4 bg-white">
              <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
            </div>
          </div>
        </div>
        
        <div v-else-if="relatedStamps.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <p class="text-primary-600">No related stamps found.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <StampCard 
            v-for="relatedStamp in relatedStamps" 
            :key="relatedStamp.id" 
            :stamp="relatedStamp" 
            compact
          />
        </div>
      </div>
    </div>
    
    <!-- Lightbox -->
    <div 
      v-if="showLightbox" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
      @click="closeLightbox"
    >
      <div 
        class="max-w-4xl max-h-full" 
        @click.stop
      >
        <img 
          :src="stamp.image" 
          :alt="stamp.title" 
          class="max-w-full max-h-[90vh] object-contain"
          :style="{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease-out'
          }"
        />
        
        <div class="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
          <button 
            @click="zoomOut"
            class="p-2 rounded-full bg-white bg-opacity-25 text-white hover:bg-opacity-50 focus:outline-none"
            :disabled="zoomLevel <= 1"
            :class="{ 'opacity-50 cursor-not-allowed': zoomLevel <= 1 }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path>
            </svg>
          </button>
          
          <button 
            @click="zoomIn"
            class="p-2 rounded-full bg-white bg-opacity-25 text-white hover:bg-opacity-50 focus:outline-none"
            :disabled="zoomLevel >= 3"
            :class="{ 'opacity-50 cursor-not-allowed': zoomLevel >= 3 }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
            </svg>
          </button>
          
          <button 
            @click="rotateLeft"
            class="p-2 rounded-full bg-white bg-opacity-25 text-white hover:bg-opacity-50 focus:outline-none"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </button>
          
          <button 
            @click="rotateRight"
            class="p-2 rounded-full bg-white bg-opacity-25 text-white hover:bg-opacity-50 focus:outline-none"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
          
          <button 
            @click="closeLightbox"
            class="p-2 rounded-full bg-white bg-opacity-25 text-white hover:bg-opacity-50 focus:outline-none"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>