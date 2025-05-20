import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Collections from '../../views/Collections.vue'

describe('Collections.vue', () => {
  it('renders collections view', () => {
    const wrapper = mount(Collections)
    expect(wrapper.exists()).toBe(true)
  })
})
