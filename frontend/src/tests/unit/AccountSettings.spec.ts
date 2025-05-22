import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import AccountSettings from '../../views/AccountSettings.vue'

// Мокаем router (Composition API)
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    params: {},
    path: '/account-settings'
  })
}))

describe('AccountSettings.vue', () => {
  it('renders account settings view', () => {
    const wrapper = mount(AccountSettings)
    expect(wrapper.exists()).toBe(true)
  })
})
