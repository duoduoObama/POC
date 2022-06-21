import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    },
  },
  resolve: {
    alias: {
      'vue': resolve(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js')
    }
  }
})
