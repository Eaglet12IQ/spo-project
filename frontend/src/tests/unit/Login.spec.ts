import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Login from '../../views/Login.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    path: '/login'
  })
}))

describe('Login.vue', () => {
  it('renders login form', () => {
    const wrapper = mount(Login)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('has username and password inputs', () => {
    const wrapper = mount(Login)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })
})
