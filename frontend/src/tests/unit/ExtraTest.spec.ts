import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import NavBar from '../../components/NavBar.vue'

// ✅ Мок vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/',
    params: {},
    query: {}
  }),
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('NavBar.vue', () => {
  it('renders NavBar component', () => {
    const wrapper = mount(NavBar, {
      global: {
        stubs: ['router-link']
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
