import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['utils'],
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        100: true,
      },
    },
    pool: 'threads'
  },
})
