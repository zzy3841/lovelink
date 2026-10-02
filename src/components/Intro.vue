<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { introConfig } from '../config'

const emit = defineEmits(['present', 'done'])

/**
 * 开场状态机：
 * envelope（合着的信封）→ opening（拆信动画）→ letter（信纸打字机）
 * → heart（提示 + 爱心按钮出现）→ counting（爱心内倒计时）→ transition（爱心放大转场）→ done
 */
const phase = ref('envelope')
const heartFly = ref(false)
const count = ref(3)

// ===== 信纸打字机（文案见 config.js 的 introConfig） =====
const lines = introConfig.letterLines
const typedLines = ref(lines.map(() => ''))
const activeLine = ref(-1) // 光标所在行
const typing = ref(false) // 序列播放中，结束后隐藏光标

let timer = null
const pending = new Set()

/** setTimeout 的统一包装，卸载时便于清理 */
const later = (fn, ms) => {
  const id = setTimeout(() => {
    pending.delete(id)
    fn()
  }, ms)
  pending.add(id)
}

/** 逐字打出 text，进度经 onUpdate 回调，完成调用 onDone */
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
      later(tick, introConfig.typeSpeed)
    } else {
      onDone()
    }
  }
  later(tick, introConfig.typeSpeed)
}

/** 信纸内容从上往下依次打出，全部打完后出现爱心按钮 */
const typeLetter = (index) => {
  if (index >= lines.length) {
    typing.value = false
    phase.value = 'heart'
    return
  }
  activeLine.value = index
  typedLines.value[index] = ''
  typeText(
    lines[index].text,
    (v) => (typedLines.value[index] = v),
    () => typeLetter(index + 1)
  )
}

/** 点击信封：拆开动画（翻盖 + 信纸升起 + 淡出，约 1.95s）后展开信纸开始打字 */
const openEnvelope = () => {
  if (phase.value !== 'envelope') return
  phase.value = 'opening'
  later(() => {
    phase.value = 'letter'
    later(() => {
      typing.value = true
      typeLetter(0)
    }, 450) // 等信纸卡片入场后再开始打字
  }, 1950)
}

/** 点击爱心：倒计时显示在爱心中间 */
const onHeartClick = () => {
  if (phase.value !== 'heart') return
  phase.value = 'counting'
  let num = 3
  count.value = num
  timer = setInterval(() => {
    num--
    count.value = num
    if (num <= 0) {
      clearInterval(timer)
      later(startTransition, 600) // 停半拍再转场
    }
  }, 1000)
}

/**
 * 转场（动画时序见 style.css 的 .intro.transition）：
 * 星空先渲染在底层 → 爱心放大盖满屏幕 → 背景/信纸淡出 → 爱心飞出屏幕
 */
const startTransition = () => {
  phase.value = 'transition'
  emit('present') // 通知父组件挂载星空页
  later(() => {
    heartFly.value = true
  }, 1150)
  later(() => {
    phase.value = 'done'
    emit('done')
  }, 2100)
}

onBeforeUnmount(() => {
  clearInterval(timer)
  pending.forEach(clearTimeout)
  pending.clear()
})
</script>

<template>
  <div v-if="phase !== 'done'" class="intro" :class="{ transition: phase === 'transition' }">
    <!-- 信封（合着 → 拆开 → 淡出） -->
    <div
      v-if="phase === 'envelope' || phase === 'opening'"
      class="envelope-wrap"
      :class="{ away: phase === 'opening' }"
    >
      <div class="envelope" :class="{ open: phase === 'opening' }" @click="openEnvelope">
        <div class="envelope-back"></div>
        <div class="envelope-letter">
          <div class="letter-line"></div>
          <div class="letter-line"></div>
          <div class="letter-line"></div>
        </div>
        <div class="envelope-front"></div>
        <div class="envelope-flap"></div>
      </div>
      <p class="envelope-hint">点击拆开信封</p>
    </div>

    <!-- 信纸卡片 + 爱心（文档流纵向排列，天然不重叠） -->
    <template v-else>
      <div class="letter-card">
        <p
          v-for="(line, i) in lines"
          :key="i"
          class="letter-text"
          :class="'align-' + (line.align || 'left')"
        >{{ typedLines[i] }}<span v-if="typing && activeLine === i" class="type-cursor"></span></p>
      </div>

      <!-- 占位隐藏：出现时不挤动信纸 -->
      <div
        class="heart-box"
        :class="{
          show: phase !== 'letter',
          counting: phase === 'counting',
          grow: phase === 'transition',
          fly: heartFly
        }"
      >
        <p class="heart-hint">{{ introConfig.heartHint }}</p>
        <button class="heart-btn" @click="onHeartClick">
          <div class="heart-shape">
            <span v-if="phase === 'counting' && count >= 1" class="heart-count">{{ count }}</span>
          </div>
        </button>
      </div>
    </template>
  </div>
</template>
