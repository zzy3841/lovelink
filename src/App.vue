<script setup>
import { ref, watch } from 'vue'
import Intro from './components/Intro.vue'
import Present from './components/Present.vue'

// BASE_URL 可能不带尾部斜杠（如 /lovelink），统一补齐后再拼接资源路径
const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/'
const videoSrc = base + 'skystar.mp4'

// 一进页面就预加载星空视频：用隐藏的 video 元素提前触发浏览器缓冲，
// Present 挂载后同一个 src 直接复用已下载的数据，避免揭幕时再等待加载
const preloader = document.createElement('video')
preloader.preload = 'auto'
Object.assign(preloader.style, {
  position: 'fixed',
  width: '0',
  height: '0',
  opacity: '0',
  pointerEvents: 'none'
})
preloader.src = videoSrc
document.body.appendChild(preloader)
preloader.load()

// 开场（Intro）与星空（Present）的场景调度：
// 转场开始时挂载星空（在底层等待揭幕），转场结束后移除开场
const showPresent = ref(false)
const introDone = ref(false)

// 转场结束、星空开始播放后，预加载元素完成使命即移除，释放内存
watch(introDone, (done) => {
  if (done) preloader.remove()
})
</script>

<template>
  <Intro v-if="!introDone" @present="showPresent = true" @done="introDone = true" />
  <Present v-if="showPresent" :video-src="videoSrc" />
</template>
