import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Collector } from '../types'
import { fetchWithTokenCheck } from '../utils/http'

export const useCollectorStore = defineStore('collectors', () => {
  const collectors = ref<Collector[]>([])

  const loading = ref(false)

  const featuredCollectors = computed(() => {
    return collectors.value.filter(collector => collector.featured)
  })

  function getCollectorById(id: string) {
    return collectors.value.find(collector => collector.id === id)
  }

  function searchCollectors(query: string) {
    if (!query) return collectors.value
    
    const searchTerm = query.toLowerCase()
    return collectors.value.filter(collector => 
      collector.name.toLowerCase().includes(searchTerm) ||
      collector.username.toLowerCase().includes(searchTerm) ||
      collector.bio.toLowerCase().includes(searchTerm) ||
      collector.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm))
    )
  }

  async function fetchCollectors() {
    loading.value = true
    try {
      const response = await fetchWithTokenCheck('http://localhost:8000/api/profiles/list')
      if (!response.ok) {
        throw new Error('Failed to fetch collectors')
      }
      const data = await response.json()
      collectors.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchTopCollectors(limit: number) {
    loading.value = true
    try {
      const response = await fetchWithTokenCheck(`http://localhost:8000/api/profiles/sorted_by_collection_value?limit=${limit}`)
      if (!response.ok) {
        throw new Error('Failed to fetch top collectors')
      }
      const data = await response.json()
      collectors.value = data
    } finally {
      loading.value = false
    }
  }

  return {
    collectors,
    loading,
    featuredCollectors,
    getCollectorById,
    searchCollectors,
    fetchCollectors,
    fetchTopCollectors
  }
})
