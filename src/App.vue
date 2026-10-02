<script setup>
import { ref } from 'vue'
import Intro from './components/Intro.vue'
import Present from './components/Present.vue'

const videoSrc = '/skystar.mp4'

// 开场（Intro）与星空（Present）的场景调度：
// 转场开始时挂载星空（在底层等待揭幕），转场结束后移除开场
const showPresent = ref(false)
const introDone = ref(false)
</script>

<template>
  <Intro v-if="!introDone" @present="showPresent = true" @done="introDone = true" />
  <Present v-if="showPresent" :video-src="videoSrc" />
</template>
