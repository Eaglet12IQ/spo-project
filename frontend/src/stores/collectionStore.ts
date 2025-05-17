import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Collection } from '../types'
import { useStampStore } from './stampStore'
import { fetchWithTokenCheck } from '../utils/http'

export const useCollectionStore = defineStore('collections', () => {
  const collections = ref<Collection[]>([])

  const loading = ref(false)

  const stampStore = useStampStore()
  
  const featuredCollections = computed(() => {
    return collections.value.filter(collection => collection.featured)
  })

  function getCollectionById(id: string) {
    return collections.value.find(collection => collection.id === id)
  }

  function getCollectionStamps(collectionId: string) {
    return stampStore.stamps.filter(stamp => stamp.collectionId === collectionId)
  }

  function getUserCollections(userId: string) {
    return collections.value.filter(collection => collection.ownerId === userId)
  }

  async function createCollection(collectionData: { name: string; description: string; imageFile: File | null }) {
    const formData = new FormData()
    formData.append('name', collectionData.name)
    formData.append('description', collectionData.description)
    if (collectionData.imageFile) {
      formData.append('image', collectionData.imageFile)
    }

    const token = localStorage.getItem('access_token')

    const response = await fetchWithTokenCheck('http://127.0.0.1:8000/api/collections', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to create collection')
    }

    const createdCollection = await response.json()
    collections.value.push(createdCollection)
  }

  async function fetchCollections() {
    loading.value = true
    try {
      const response = await fetchWithTokenCheck('http://127.0.0.1:8000/api/collections', {
        method: 'GET',
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch collections')
      }
      const data = await response.json()
      collections.value = data
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  return {
    collections,
    loading,
    featuredCollections,
    getCollectionById,
    getCollectionStamps,
    getUserCollections,
    createCollection,
    fetchCollections
  }
})
