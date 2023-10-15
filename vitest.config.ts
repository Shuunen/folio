import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      100: true,
      reporter: ['text', 'lcov', 'html'],
      exclude: ['tests'],
    },
  },
})
