import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchWithTokenCheck } from '../utils/http'
import type { Stamp, StampFilter } from '../types'

export const useStampStore = defineStore('stamps', () => {
  const stamps = ref<Stamp[]>([])

  const topExpensiveStamps = ref<Stamp[]>([])

  const loading = ref(false)
  const filters = ref<StampFilter>({
    search: '',
    country: '',
    yearFrom: null,
    yearTo: null,
    themes: [],
    rarity: ''
  })

  const filteredStamps = computed(() => {
    return stamps.value.filter(stamp => {
      // Search filter
      if (filters.value.search && !stamp.name.toLowerCase().includes(filters.value.search.toLowerCase()) && 
          !(stamp.features?.toLowerCase().includes(filters.value.search.toLowerCase()) || stamp.topic?.toLowerCase().includes(filters.value.search.toLowerCase()))) {
        return false
      }
      
      // Country filter
      if (filters.value.country && stamp.country !== filters.value.country) {
        return false
      }
      
      // Year range filter
      if (filters.value.yearFrom && stamp.year < filters.value.yearFrom) {
        return false
      }
      if (filters.value.yearTo && stamp.year > filters.value.yearTo) {
        return false
      }
      
      // Themes filter
      if (filters.value.themes.length > 0 && !filters.value.themes.some((theme: string) => stamp.topic?.includes(theme))) {
        return false
      }
      
      // Rarity filter
      if (filters.value.rarity && stamp.rarity !== filters.value.rarity) {
        return false
      }
      
      return true
    })
  })

  async function fetchStampById(id: string) {
    loading.value = true
    try {
      const response = await fetchWithTokenCheck(`http://localhost:8000/api/stamps/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch stamp')
      }
      const data = await response.json()
      // Update or add the stamp in the stamps array
      const index = stamps.value.findIndex(stamp => stamp.id === data.id)
      if (index !== -1) {
        stamps.value[index] = data
      } else {
        stamps.value.push(data)
      }
      return data
    } finally {
      loading.value = false
    }
  }

  async function fetchTopExpensiveStamps() {
    loading.value = true
    try {
      const response = await fetchWithTokenCheck('http://localhost:8000/api/stamps/top_expensive')
      if (!response.ok) {
        throw new Error('Failed to fetch top expensive stamps')
      }
      const data = await response.json()
      topExpensiveStamps.value = data
    } finally {
      loading.value = false
    }
  }

  async function deleteStamp(id: string) {
    loading.value = true
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetchWithTokenCheck(`http://localhost:8000/api/stamps/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to delete stamp')
      }
      // Remove deleted stamp from stamps array
      stamps.value = stamps.value.filter(stamp => stamp.id !== id)
    } finally {
      loading.value = false
    }
  }

  async function fetchStamps() {
    loading.value = true
    try {
      const response = await fetchWithTokenCheck('http://localhost:8000/api/stamps')
      if (!response.ok) {
        throw new Error('Failed to fetch stamps')
      }
      const data = await response.json()
      stamps.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchStampsBySearch(query: string) {
    loading.value = true
    try {
      const response = await fetchWithTokenCheck(`http://localhost:8000/search/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch stamps by search')
      }
      const data = await response.json()
      // Update stamps with the stamps from search results
      stamps.value = data.stamps
    } finally {
      loading.value = false
    }
  }

  const groupedRareStamps = ref([])

  async function fetchGroupedRareStamps() {
    loading.value = true
    try {
      const response = await fetchWithTokenCheck('http://localhost:8000/api/stamps/grouped_rare')
      if (!response.ok) {
        throw new Error('Failed to fetch grouped rare stamps')
      }
      const data = await response.json()
      groupedRareStamps.value = data
    } finally {
      loading.value = false
    }
  }

  function getStampById(id: string) {
    return stamps.value.find(stamp => stamp.id === id)
  }

  function getRelatedStamps(stampId: string, limit: number = 4) {
    const stamp = getStampById(stampId)
    if (!stamp) return []
    
    return stamps.value
      .filter(s => s.id !== stampId && 
               (s.country === stamp.country || 
                (s.topic && stamp.topic && s.topic === stamp.topic)))
      .slice(0, limit)
  }

  function setFilter(newFilters: Partial<StampFilter>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      search: '',
      country: '',
      yearFrom: null,
      yearTo: null,
      themes: [],
      rarity: ''
    }
  }

  async function createStamp(collectionId: string, stampData: any, imageFile: File) {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('name', stampData.name)
      formData.append('serial_number', stampData.serial_number || '')
      formData.append('country', stampData.country)
      formData.append('year', stampData.year.toString())
      if (stampData.circulation !== null && stampData.circulation !== undefined) {
        formData.append('circulation', stampData.circulation.toString())
      }
      if (stampData.cost !== null && stampData.cost !== undefined) {
        formData.append('cost', stampData.cost.toString())
      }
      formData.append('perforation', stampData.perforation || '')
      formData.append('topic', stampData.topic || '')
      formData.append('features', stampData.features || '')
      formData.append('image', imageFile)
      formData.append('collection_id', collectionId)

      const token = localStorage.getItem('access_token')

      const response = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/stamps/create`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to create stamp')
      }
      const data = await response.json()
      stamps.value.push(data)
      return data
    } finally {
      loading.value = false
    }
  }

  async function updateStamp(stampId: number, stampData: { name: string; serial_number: string; country: string; year: number; circulation: number; cost: number; perforation: string; topic: string; features: string; imageFile: File | null }) {
    const formData = new FormData()
    formData.append('name', stampData.name)
    formData.append('serial_number', stampData.serial_number)
    formData.append('country', stampData.country)
    formData.append('year', stampData.year.toString())
    formData.append('circulation', stampData.circulation.toString())
    formData.append('cost', stampData.cost.toString())
    formData.append('perforation', stampData.perforation)
    formData.append('topic', stampData.topic)
    formData.append('features', stampData.features)
    if (stampData.imageFile) {
      formData.append('image', stampData.imageFile)
    }

    const token = localStorage.getItem('access_token')

    const response = await fetchWithTokenCheck(`http://127.0.0.1:8000/api/stamps/update/${stampId}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to update stamp')
    }

    const updatedStamp = await response.json()
    // Update the stamp in stamps array
    const index = stamps.value.findIndex(s => s.id === updatedStamp.id)
    if (index !== -1) {
      stamps.value[index] = updatedStamp
    }
    // Remove or comment out the following lines because currentStamp is not defined
    // if (currentStamp.value?.id === updatedStamp.id) {
    //   currentStamp.value = updatedStamp
    // }
    return updatedStamp
  }

  return { 
    stamps, 
    topExpensiveStamps,
    loading, 
    filters,
    filteredStamps,
    getStampById,
    getRelatedStamps,
    setFilter,
    resetFilters,
    fetchStampById,
    fetchStamps,
    fetchStampsBySearch,
    fetchGroupedRareStamps,
    fetchTopExpensiveStamps,
    groupedRareStamps,
    createStamp,
    updateStamp,
    deleteStamp
  }
})
