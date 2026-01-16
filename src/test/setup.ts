import { beforeAll } from 'vitest'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Setup for Vue Test Utils
beforeAll(() => {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  })

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

// Global test utilities
global.createTestApp = () => {
  const app = createApp({})
  const pinia = createPinia()
  app.use(pinia)
  return { app, pinia }
}