import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Stamps from '../../views/Stamps.vue'

describe('Stamps.vue', () => {
  it('renders stamps view', () => {
    const wrapper = mount(Stamps)
    expect(wrapper.exists()).toBe(true)
  })
})
