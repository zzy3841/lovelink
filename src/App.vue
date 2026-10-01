<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Present from './components/Present.vue'
import { isMobile } from './config'

const videoSrc = '/skystar.mp4'

// 移动端打字机样式走 .printer-div.mobile（见 style.css）
const mobile = isMobile()

const showPresent = ref(false)
const showTime = ref(false)
const count = ref(3)
const userName = ref('')
let timer = null

/** 网页全屏 */
const requestFullscreen = () => {
  if (!document.fullscreenElement) {
    document.body.requestFullscreen().catch(() => {})
  }
}

const startCountdown = () => {
  let num = count.value
  timer = setInterval(() => {
    if (num <= 0) {
      clearInterval(timer)
      showPresent.value = true
      requestFullscreen()
    }
    count.value = --num
  }, 1000)
}

const onClickButton = () => {
  showTime.value = true
  startCountdown()
}

/**
 * 获取url?后面的参数值
 * @param name 所要获取的参数名
 *
 * eg:
 *  https://www.baidu.com?param1=111&parma2=222
 *  getQueryString('param1') ---> 111
 */
const getQueryString = (name) => {
  const urlParams = new URLSearchParams(window.location.search)
  return decodeURIComponent(urlParams.get(name))
}

onMounted(() => {
  const name = getQueryString('name')
  userName.value = name !== 'null' ? name : ''
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <div v-if="!showPresent" class="printer-div" :class="{ mobile }">
    嘿，{{ userName ? userName + '，' : '' }}点击这个按钮，开启你的礼物^_^
    &nbsp;
    <button @click="onClickButton">这个按钮</button>
  </div>

  <div v-if="showTime" class="time-div">
    <template v-if="!showPresent">
      <h3 v-if="count >= 1">还有：<b>{{ count }}s</b></h3>
      <h2 v-else>开始！</h2>
    </template>
  </div>

  <Present v-if="showPresent" :video-src="videoSrc" />
</template>
