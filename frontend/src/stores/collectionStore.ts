import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Collection, Stamp } from '../types'
import { useStampStore } from './stampStore'
import { fetchWithTokenCheck } from '../utils/http'

export const useCollectionStore = defineStore('collections', () => {
  const collections = ref<Collection[]>([])
  const groupedCollections = ref<any[]>([]) // New property for grouped collections
  const currentCollection = ref<Collection | null>(null)  // 👈 добавлено

  const loading = ref(false)
  const stampStore = useStampStore()

  const featuredCollections = computed(() => {
    return collections.value.filter(collection => collection.featured)
  })

  function getCollectionById(id: string) {
    return collections.value.find(collection => collection.id === id)
  }

  function getCollectionStamps() {
    // Since stamps are nested inside currentCollection, return them directly
    return currentCollection.value?.stamps || []
  }

  async function createCollection(collectionData: { name: string; description: string; imageFile: File | null }) {
    const formData = new FormData()
    formData.append('name', collectionData.name)
    formData.append('description', collectionData.description)
    if (collectionData.imageFile) {
      formData.append('image', collectionData.imageFile)
    }

    const token = localStorage.getItem('access_token')

    const response = await fetchWithTokenCheck('http://127.0.0.1:8000/api/collections/create', {
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
    return createdCollection
  }

  async function updateCollection(collectionId: string, collectionData: { name: string; description: string; imageFile: File | null }) {
    const formData = new FormData()
    formData.append('name', collectionData.name)
    formData.append('description', collectionData.description)
    if (collectionData.imageFile) {
      formData.append('image', collectionData.imageFile)
    }

    const token = localStorage.getItem('access_token')

    const response = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/collections/update/${collectionId}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to update collection')
    }

    const updatedCollection = await response.json()
    // Update the collection in collections array
    const index = collections.value.findIndex(c => c.id === updatedCollection.id)
    if (index !== -1) {
      collections.value[index] = updatedCollection
    }
    // Update currentCollection if it matches
    if (currentCollection.value?.id === updatedCollection.id) {
      currentCollection.value = updatedCollection
    }
    return updatedCollection
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

  // 👇 ДОБАВЛЯЕМ ЭТО
  async function fetchGroupedCollections() {
    loading.value = true
    try {
      const response = await fetchWithTokenCheck('http://127.0.0.1:8000/api/collections/grouped', {
        method: 'GET',
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch grouped collections')
      }
      const data = await response.json()
      groupedCollections.value = data
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  async function fetchCollectionById(id: string) {
    loading.value = true
    try {
      const response = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/collections/${id}`, {
        method: 'GET',
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch collection')
      }
      const data = await response.json()
      currentCollection.value = data
      return currentCollection
    } catch (error) {
      console.error('fetchCollectionById error:', error)
    } finally {
      loading.value = false
    }
  }

  async function deleteCollection(id: string) {
    loading.value = true
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/collections/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to delete collection')
      }
      // Remove deleted collection from collections array
      collections.value = collections.value.filter(collection => collection.id !== id)
      // Clear currentCollection if it was deleted
      if (currentCollection.value?.id === id) {
        currentCollection.value = null
      }
    } catch (error) {
      console.error('deleteCollection error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getCollection = computed(() => currentCollection.value)

  return {
    collections,
    groupedCollections, // Export groupedCollections
    currentCollection,
    loading,
    featuredCollections,
    getCollectionById,
    getCollectionStamps,
    createCollection,
    fetchCollections,
    fetchGroupedCollections, // Export fetchGroupedCollections
    fetchCollectionById,  // 👈 экспортируем
    deleteCollection,
    getCollection,
    updateCollection
  }
})
