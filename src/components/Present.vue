<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { words, wordsToPhone } from '../data'

defineProps({
  videoSrc: {
    type: String,
    required: true
  }
})

const videoRef = ref(null)
const finalShown = ref(false)
let finalTimer = null

/** 对应原项目 current-device 的 device.desktop() */
const isDesktop = () =>
  !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

const randomNum = (min, max) => (Math.random() * (max - min + 1) + min).toFixed(2)

// 桌面端与移动端使用不同的词库（同原项目）
const wordList = (isDesktop() ? words : wordsToPhone).map((w) => ({
  text: w,
  marginTop: randomNum(-40, 20) + 'vh',
  marginLeft: randomNum(6, 35) + 'vw',
  duration: randomNum(8, 20) + 's',
  delay: randomNum(-20, 0) + 's'
}))

onMounted(() => {
  const video = videoRef.value
  if (video) {
    video.volume = 0.5
    // 用户已点击过按钮，带声音自动播放一般没问题；失败则降级为静音播放
    video.play().catch(() => {
      video.muted = true
      video.play()
    })
  }

  // 10 秒后切换文案（同原项目）
  finalTimer = setTimeout(() => {
    finalShown.value = true
  }, 10000)
})

onBeforeUnmount(() => {
  clearTimeout(finalTimer)
})
</script>

<template>
  <div class="sky">
    <div class="videofilm">
      <video ref="videoRef" :src="videoSrc" loop playsinline></video>
    </div>

    <div class="textone">
      <h1 v-if="!finalShown">look at the stars</h1>
      <h1 v-else class="final-text">今晚，整片星空将为你一人闪烁</h1>
    </div>
    <div class="text">
      <h1 v-if="!finalShown">look how they shine for u</h1>
    </div>

    <div class="container textContainer">
      <div
        v-for="(w, i) in wordList"
        :key="i"
        class="word-box"
        :style="{
          '--margin-top': w.marginTop,
          '--margin-left': w.marginLeft,
          '--animation-duration': w.duration,
          '--animation-delay': w.delay
        }"
      >
        <div class="word">{{ w.text }}</div>
      </div>
    </div>
  </div>
</template>
