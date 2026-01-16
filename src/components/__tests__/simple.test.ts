import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

// Create a simple test component inline
const SimpleComponent = {
  template: '<div class="simple">{{ message }}</div>',
  props: ['message']
}

describe('Simple Component', () => {
  it('renders message prop correctly', () => {
    const wrapper = mount(SimpleComponent, {
      props: {
        message: 'Hello World'
      }
    })

    expect(wrapper.text()).toBe('Hello World')
    expect(wrapper.classes()).toContain('simple')
  })

  it('renders default state', () => {
    const wrapper = mount(SimpleComponent)

    expect(wrapper.exists()).toBe(true)
  })
})