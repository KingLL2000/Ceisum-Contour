import { defineConfig } from 'vite'
import { resolve } from 'path'
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/Cesium-Contour/index.js'),
      name: 'CesiumContour',
      fileName: 'cesium-contour',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // 移除 external，将所有依赖打包在一起
      external: ['cesium'],
    },
    copyPublicDir: false
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
})