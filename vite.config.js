import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 相对路径：HBuilderX 5+App 打包后页面走 file:// 协议，绝对路径资源会 404
  base: './',
  plugins: [vue()]
})
