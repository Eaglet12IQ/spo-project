import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/authStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useStampStore } from '../../stores/stampStore'
import { useCollectorStore } from '../../stores/collectorStore'

describe('Pinia Stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('authStore initializes correctly', () => {
    const authStore = useAuthStore()
    expect(authStore.user).toBeNull()
    expect(authStore.isAuthenticated).toBe(false)
  })

  it('collectionStore initializes correctly', () => {
    const collectionStore = useCollectionStore()
    expect(collectionStore.collections).toEqual([])
  })

  it('stampStore initializes correctly', () => {
    const stampStore = useStampStore()
    expect(stampStore.stamps).toEqual([])
  })

  it('collectorStore initializes correctly', () => {
    const collectorStore = useCollectorStore()
    expect(collectorStore.collectors).toEqual([])
  })
})
