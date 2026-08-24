import { defineConfig } from 'vitest/config'

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/**/*.{json,css}'],
      include: ['src'],
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        100: true,
      },
    },
    include: ['src/**/*.test.ts'],
    reporters: ['minimal'],
  },
})
