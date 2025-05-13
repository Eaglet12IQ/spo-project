import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Collector } from '../types'

export const useCollectorStore = defineStore('collectors', () => {
  const collectors = ref<Collector[]>([
    {
      id: '1',
      username: 'johndoe',
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: 'Passionate stamp collector since 2005. Specializing in vintage European stamps.',
      location: 'Нью-Йорк, США',
      memberSince: '2021-05-15',
      collectionCount: 7,
      stampCount: 342,
      specialties: ['European Classics', 'Aviation', 'Maritime'],
      following: 28,
      followers: 47,
      featured: true
    },
    {
      id: '2',
      username: 'emilyjohnson',
      name: 'Emily Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: 'Professional philatelist with a focus on rare Asian stamps and postal history.',
      location: 'Лондон, Великобритания',
      memberSince: '2019-11-23',
      collectionCount: 12,
      stampCount: 876,
      specialties: ['Asian Rarities', 'Postal History', 'Imperial China'],
      following: 45,
      followers: 132,
      featured: true
    },
    {
      id: '3',
      username: 'michaelsmith',
      name: 'Michael Smith',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: 'Third-generation collector focusing on American stamps from 1850 to 1950.',
      location: 'Chicago, USA',
      memberSince: '2020-03-17',
      collectionCount: 5,
      stampCount: 523,
      specialties: ['American Classics', 'Presidential Series', 'Commemoratives'],
      following: 19,
      followers: 67,
      featured: false
    },
    {
      id: '4',
      username: 'sophiawilliams',
      name: 'Sophia Williams',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bio: 'Enthusiast collector of botanical and wildlife stamps from around the world.',
      location: 'Sydney, Australia',
      memberSince: '2022-01-08',
      collectionCount: 9,
      stampCount: 418,
      specialties: ['Flora', 'Fauna', 'Conservation Series'],
      following: 32,
      followers: 51,
      featured: false
    }
  ])

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

  return {
    collectors,
    loading,
    featuredCollectors,
    getCollectorById,
    searchCollectors
  }
})