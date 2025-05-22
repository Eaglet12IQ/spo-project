import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

// ✅ Мок vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: 'test-id',
    },
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// ✅ Мок alert и fetch для jsdom
beforeAll(() => {
  global.alert = vi.fn()
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
    })
  ) as any
})

// ✅ Импорт компонентов
import Collectors from '../../views/Collectors.vue'
import StampDetail from '../../views/StampDetail.vue'
import CreateStamp from '../../views/CreateStamp.vue'
import EditStamp from '../../views/EditStamp.vue'
import CollectionDetail from '../../views/CollectionDetail.vue'
import EditCollection from '../../views/EditCollection.vue'

// ✅ Обёртка mount с глобальными плагинами
const mountWithPlugins = (component: any) =>
  mount(component, {
    global: {
      plugins: [createTestingPinia()],
      stubs: ['router-link', 'router-view'],
    },
  })

// ✅ Тесты
describe('Collectors.vue', () => {
  it('renders collectors view', () => {
    const wrapper = mountWithPlugins(Collectors)
    expect(wrapper.exists()).toBe(true)
  })
})

describe('StampDetail.vue', () => {
  it('renders stamp detail view', () => {
    const wrapper = mountWithPlugins(StampDetail)
    expect(wrapper.exists()).toBe(true)
  })
})

describe('CreateStamp.vue', () => {
  it('renders create stamp view', () => {
    const wrapper = mountWithPlugins(CreateStamp)
    expect(wrapper.exists()).toBe(true)
  })
})

describe('EditStamp.vue', () => {
  it('renders edit stamp view', () => {
    const wrapper = mountWithPlugins(EditStamp)
    expect(wrapper.exists()).toBe(true)
  })
})

describe('CollectionDetail.vue', () => {
  it('renders collection detail view', () => {
    const wrapper = mountWithPlugins(CollectionDetail)
    expect(wrapper.exists()).toBe(true)
  })
})

describe('EditCollection.vue', () => {
  it('renders edit collection view', () => {
    const wrapper = mountWithPlugins(EditCollection)
    expect(wrapper.exists()).toBe(true)
  })
})
