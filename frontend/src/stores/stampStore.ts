import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Stamp, StampFilter } from '../types'

export const useStampStore = defineStore('stamps', () => {
  const stamps = ref<Stamp[]>([
    {
      id: '1',
      title: 'Penny Black',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Penny_black.jpg',
      country: 'Великобритания',
      year: 1840,
      denomination: '2000$',
      color: 'Black',
      condition: 'Mint',
      description: 'The Penny Black was the world\'s first adhesive postage stamp used in a public postal system. It was first issued in the United Kingdom on 1 May 1840, for official use from 6 May of that year.',
      rarity: 'Редкая',
      themes: ['Historic', 'First Issue'],
      dimensions: '19mm × 22mm',
      perforations: 'Imperforate',
      catalogNumber: 'SG1',
      estimatedValue: 2000,
      collectionId: '1'
    },
    {
      id: '2',
      title: 'Inverted Jenny',
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/US_Airmail_inverted_Jenny_24c_1918_issue.jpg',
      country: 'США',
      year: 1918,
      denomination: '1000000$',
      color: 'Red and Blue',
      condition: 'Fine',
      description: 'The Inverted Jenny is one of the world\'s most famous stamp errors, showing a Curtiss JN-4 airplane printed upside-down. Only 100 copies are known to exist.',
      rarity: 'Редкая ',
      themes: ['Aviation', 'Error'],
      dimensions: '22mm × 25mm',
      perforations: 'Perf 11',
      catalogNumber: 'US C3a',
      estimatedValue: 1000000,
      collectionId: '2'
    },
    {
      id: '3',
      title: 'Blue Mauritius',
      image: 'https://avatars.mds.yandex.net/i?id=08db0a8d7ecab32f2dd2546435690fc91cfc1c7c-9035616-images-thumbs&n=13',
      country: 'Маврикий',
      year: 1847,
      denomination: '1500000$',
      color: 'Blue',
      condition: 'Used',
      description: 'The Blue Mauritius is one of the rarest and most valuable stamps in the world. The stamp reads "Post Office" instead of "Post Paid".',
      rarity: 'Редкая',
      themes: ['Colonial', 'Queen Victoria'],
      dimensions: '18mm × 20mm',
      perforations: 'Imperforate',
      catalogNumber: 'Mauritius PO2',
      estimatedValue: 1500000,
      collectionId: '3'
    },
    {
      id: '4',
      title: 'Treskilling Yellow',
      image: 'https://images.pexels.com/photos/12605196/pexels-photo-12605196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      country: 'Sweden',
      year: 1855,
      denomination: '3 Skilling',
      color: 'Yellow (Error)',
      condition: 'Fine Used',
      description: 'The Treskilling Yellow is a Swedish postage stamp that was mistakenly printed in yellow instead of green. Only one example is known to exist.',
      rarity: 'Unique',
      themes: ['Error', 'European'],
      dimensions: '19mm × 21mm',
      perforations: 'Imperforate',
      catalogNumber: 'Sweden 3',
      estimatedValue: 2500000,
      collectionId: '1'
    },
    {
      id: '5',
      title: 'Basel Dove',
      image: 'https://images.pexels.com/photos/12094618/pexels-photo-12094618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      country: 'Switzerland',
      year: 1845,
      denomination: '2½ Rappen',
      color: 'Red, Blue, and Black',
      condition: 'Very Fine',
      description: 'The Basel Dove was the first tricolor stamp in the world, showing a white embossed dove carrying a letter in its beak.',
      rarity: 'High',
      themes: ['Bird', 'Swiss'],
      dimensions: '21mm × 24mm',
      perforations: 'Imperforate',
      catalogNumber: 'Basel 1',
      estimatedValue: 75000,
      collectionId: '2'
    },
    {
      id: '6',
      title: 'Hawaiian Missionaries',
      image: 'https://images.pexels.com/photos/18932766/pexels-photo-18932766/free-photo-of-old-envelopes-with-stamps.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      country: 'Hawaii',
      year: 1851,
      denomination: '2 Cents',
      color: 'Blue',
      condition: 'Fine',
      description: 'The Hawaiian Missionaries were the first stamps issued by Hawaii, mainly used for mail sent by American missionaries in the islands.',
      rarity: 'Extremely High',
      themes: ['American', 'Colonial'],
      dimensions: '20mm × 23mm',
      perforations: 'Imperforate',
      catalogNumber: 'Hawaii 1',
      estimatedValue: 760000,
      collectionId: '3'
    }
  ])

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
      if (filters.value.search && !stamp.title.toLowerCase().includes(filters.value.search.toLowerCase()) && 
          !stamp.description.toLowerCase().includes(filters.value.search.toLowerCase())) {
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
      if (filters.value.themes.length > 0 && !filters.value.themes.some(theme => stamp.themes.includes(theme))) {
        return false
      }
      
      // Rarity filter
      if (filters.value.rarity && stamp.rarity !== filters.value.rarity) {
        return false
      }
      
      return true
    })
  })

  function getStampById(id: string) {
    return stamps.value.find(stamp => stamp.id === id)
  }

  function getRelatedStamps(stampId: string, limit: number = 4) {
    const stamp = getStampById(stampId)
    if (!stamp) return []
    
    return stamps.value
      .filter(s => s.id !== stampId && 
               (s.country === stamp.country || 
                s.themes.some(theme => stamp.themes.includes(theme))))
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

  return { 
    stamps, 
    loading, 
    filters,
    filteredStamps,
    getStampById,
    getRelatedStamps,
    setFilter,
    resetFilters
  }
})