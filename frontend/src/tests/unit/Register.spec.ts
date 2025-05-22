import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Register from '../../views/Register.vue'

// Мокаем vue-router (если используется Composition API)
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    path: '/register'
  })
}))

describe('Register.vue', () => {
  it('renders register form', () => {
    const wrapper = mount(Register)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('has username, email and password inputs', () => {
    const wrapper = mount(Register)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })
})
