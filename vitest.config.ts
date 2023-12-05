import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        100: true,
      },
      reporter: ['text', 'lcov', 'html'],
      include: ['utils'],
    },
  },
})
