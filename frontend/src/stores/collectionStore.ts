import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Collection } from '../types'
import { useStampStore } from './stampStore'

export const useCollectionStore = defineStore('collections', () => {
  const collections = ref<Collection[]>([
    {
      id: '1',
      title: 'British Classics',
      description: 'Classic stamps from Great Britain, including rare Victorian era pieces.',
      coverImage: 'https://images.pexels.com/photos/7267684/pexels-photo-7267684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      ownerId: '1',
      createdAt: '2022-03-15',
      updatedAt: '2023-11-05',
      isPublic: true,
      theme: 'Historical',
      stampCount: 42,
      featured: true
    },
    {
      id: '2',
      title: 'Aviation Marvels',
      description: 'A collection dedicated to the history of aviation as depicted on postage stamps worldwide.',
      coverImage: 'https://images.pexels.com/photos/12605196/pexels-photo-12605196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      ownerId: '2',
      createdAt: '2021-07-22',
      updatedAt: '2023-12-01',
      isPublic: true,
      theme: 'Transportation',
      stampCount: 87,
      featured: true
    },
    {
      id: '3',
      title: 'Island Nations',
      description: 'Rare and beautiful stamps from island nations around the world.',
      coverImage: 'https://images.pexels.com/photos/19180878/pexels-photo-19180878/free-photo-of-vintage-mail-envelopes-with-postage-stamps.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      ownerId: '3',
      createdAt: '2022-01-10',
      updatedAt: '2023-10-18',
      isPublic: true,
      theme: 'Geography',
      stampCount: 63,
      featured: false
    }
  ])

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

  return {
    collections,
    loading,
    featuredCollections,
    getCollectionById,
    getCollectionStamps,
    getUserCollections
  }
})