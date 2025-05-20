import { beforeEach } from 'vitest'
import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

// Stub router-link component globally
config.global.stubs = {
  'router-link': true
}

// Stub motion directive globally
config.global.directives = {
  motion: {}
}

// Mock $route and $router globally to fix router injection warnings
config.global.mocks = {
  $route: {
    params: {
      collector_id: '123'
    }
  },
  $router: {
    push: () => {}
  }
}

// Suppress Vue warn logs during tests
beforeEach(() => {
  setActivePinia(createPinia())
})
