import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  resolve: {
    alias: {
      assets: resolve(__dirname, 'src/assets'),
      components: resolve(__dirname, 'src/components'),
      config: resolve(__dirname, 'src/config'),
      modules: resolve(__dirname, 'src/modules'),
      store: resolve(__dirname, 'src/store'),
      utils: resolve(__dirname, 'src/utils'),
    },
  },
  plugins: [vue()],
})
