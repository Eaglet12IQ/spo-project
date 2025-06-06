import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    include: ['src/tests/unit/**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
})
