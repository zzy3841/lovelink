<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { words } from '../data'
import { presentConfig, titleConfig, isMobile } from '../config'

defineProps({
  videoSrc: {
    type: String,
    required: true
  }
})

const videoRef = ref(null)

// 移动端与桌面端使用各自的词库和参数配置
const mobile = isMobile()
const cfg = mobile ? presentConfig.mobile : presentConfig.desktop

// ===== 标题打字机序列（文案见 config.js 的 titleConfig） =====
const currentItem = ref(null) // 当前文案项
const typedTop = ref('') // 顶行已输入部分
const typedBottom = ref('') // 底行已输入部分
const activeLine = ref('top') // 光标所在行：top / bottom
const titlePlaying = ref(true) // 序列播放中，结束后隐藏光标
let titleTimer = null

const typeText = (text, onUpdate, onDone) => {
  if (!text) {
    onDone()
    return
  }
  let i = 0
  const tick = () => {
    i++
    onUpdate(text.slice(0, i))
    if (i < text.length) {
      titleTimer = setTimeout(tick, titleConfig.typeSpeed)
    } else {
      onDone()
    }
  }
  titleTimer = setTimeout(tick, titleConfig.typeSpeed)
}

/**
 * 播放第 index 项：顶行打字 → 底行打字 → 停留（该项 holdTime，未配置用公用值）→ 下一项
 * 最后一项播放完即停止，文字保留在屏幕上
 */
const playTitle = (index) => {
  const item = titleConfig.sequence[index]
  if (!item) {
    titlePlaying.value = false
    return
  }
  currentItem.value = item
  typedTop.value = ''
  typedBottom.value = ''
  activeLine.value = 'top'
  typeText(
    item.top,
    (v) => (typedTop.value = v),
    () => {
      activeLine.value = 'bottom'
      typeText(
        item.bottom,
        (v) => (typedBottom.value = v),
        () => {
          titleTimer = setTimeout(() => playTitle(index + 1), item.holdTime ?? titleConfig.holdTime)
        }
      )
    }
  )
}

const randomNum = (min, max) => (Math.random() * (max - min + 1) + min).toFixed(2)

/** 按配置数量随机挑取诗句（0 或超过词库长度时全部显示） */
const pickWords = (list, count) => {
  if (!count || count >= list.length) return list
  return [...list].sort(() => Math.random() - 0.5).slice(0, count)
}

const wordList = pickWords(words, cfg.wordCount).map((w) => ({
  text: w,
  // 分布位置与密集程度
  marginTop: randomNum(...cfg.density.marginTop) + 'vh',
  marginLeft: randomNum(...cfg.density.marginLeft) + 'vw',
  // 旋转一圈耗时（越小转得越快）
  duration: randomNum(...cfg.rotateDuration) + 's',
  delay: randomNum(-20, 0) + 's'
}))

// 诗句逐个出现：按 appearInterval 间隔依次渲染，0 表示全部立即出现
const shownCount = ref(cfg.appearInterval > 0 ? 0 : wordList.length)
const visibleWords = computed(() => wordList.slice(0, shownCount.value))
let appearTimer = null

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

  setTimeout(() => playTitle(0), 2000)

  // 诗句按配置频率逐个出现
  if (cfg.appearInterval > 0 && wordList.length) {
    appearTimer = setInterval(() => {
      shownCount.value++
      if (shownCount.value >= wordList.length) clearInterval(appearTimer)
    }, cfg.appearInterval)
  }
})

onBeforeUnmount(() => {
  clearTimeout(titleTimer)
  clearInterval(appearTimer)
})
</script>

<template>
  <div class="sky">
    <div class="videofilm">
      <video ref="videoRef" :src="videoSrc" loop playsinline></video>
    </div>

    <div class="textone">
      <h1
        v-if="currentItem"
        class="defaultText"
        :class="currentItem.topClass"
        :style="{ fontSize: currentItem.fontSize || cfg.titleFontSize }"
      >{{ typedTop }}<span v-if="titlePlaying && activeLine === 'top'" class="type-cursor"></span></h1>
    </div>
    <div class="text">
      <h1
        v-if="currentItem && currentItem.bottom && (typedBottom || activeLine === 'bottom')"
        class="defaultText"
        :class="currentItem.bottomClass || currentItem.topClass"
        :style="{ fontSize: currentItem.fontSize || cfg.titleFontSize }"
      >{{ typedBottom }}<span v-if="titlePlaying && activeLine === 'bottom'" class="type-cursor"></span></h1>
    </div>

    <div class="container textContainer" :style="{ fontSize: cfg.wordFontSize }">
      <div
        v-for="(w, i) in visibleWords"
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
