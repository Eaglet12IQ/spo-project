import { vi, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '../../views/Home.vue'

// Мокаем vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    path: '/',
    name: 'home',
    params: {}
  })
}))

describe('Home.vue', () => {
  it('renders home view', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: ['router-link']
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
