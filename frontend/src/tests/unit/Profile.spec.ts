import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Profile from '../../views/Profile.vue'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      collector_id: '123'
    }
  }),
  useRouter: () => ({
    push: vi.fn()
  })
}))

// Mock fetchWithTokenCheck to avoid real API calls
vi.mock('../../utils/http', () => ({
  fetchWithTokenCheck: vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ username: 'Mock User' })
    })
  )
}))

describe('Profile.vue', () => {
  it('renders profile view', async () => {
    const wrapper = mount(Profile, {
      global: {
        stubs: ['router-link']
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
