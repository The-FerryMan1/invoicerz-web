import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '@/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with count 0', () => {
    const counterStore = useCounterStore()

    expect(counterStore.count).toBe(0)
  })

  it('increments count', () => {
    const counterStore = useCounterStore()

    counterStore.increment()

    expect(counterStore.count).toBe(1)
  })

  it('increments multiple times', () => {
    const counterStore = useCounterStore()

    counterStore.increment()
    counterStore.increment()
    counterStore.increment()

    expect(counterStore.count).toBe(3)
  })

  it('computes doubleCount correctly', () => {
    const counterStore = useCounterStore()

    counterStore.increment() // count = 1

    expect(counterStore.doubleCount).toBe(2)

    counterStore.increment() // count = 2

    expect(counterStore.doubleCount).toBe(4)
  })

  it('doubleCount updates when count changes', () => {
    const counterStore = useCounterStore()

    expect(counterStore.doubleCount).toBe(0)

    counterStore.increment()

    expect(counterStore.doubleCount).toBe(2)
  })
})