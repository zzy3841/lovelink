/**
 * 礼物页（Present）可配置参数
 *
 * - wordCount       诗句显示数量，0 表示全部
 * - rotateDuration  诗句旋转一圈的耗时范围 [min, max]（秒），数值越小转得越快
 * - density         诗句分布范围（密集程度），范围越小越密集
 *                     marginTop  垂直分布 [min, max]（vh）
 *                     marginLeft 水平分布 [min, max]（vw）
 * - wordFontSize    诗句字号（移动端用 vw 单位，随屏幕宽度缩放）
 * - titleFontSize   标题字号（移动端用 vw 单位）
 *
 * 预览另一端效果可在 url 上加强制参数：?device=mobile 或 ?device=desktop
 */
/**
 * 标题文案序列（Present 页中央文字）：
 * 每项依次以打字机效果输入（先顶行、后底行）→ 停留 → 播放下一项；
 * 最后一项播放完即停止，文字保留在屏幕上。
 * 停留时间：默认用下方公用的 holdTime，单项配置了 holdTime 则用该项自己的。
 */
export const titleConfig = {
  sequence: [
    { top: 'look at the stars', bottom: 'look how they shine for u', holdTime: 10000 },
    // 单项覆盖示例：{ top: '...', bottom: '', holdTime: 6000 }
    { top: '今晚，整片星空将为你一人闪烁', bottom: '', topClass: 'final-text' }
  ],
  typeSpeed: 150, // 打字速度：每个字符出现的间隔（ms）
  holdTime: 1000  // 公用停留时间（ms）：每项打完后停留此时长再进入下一项
}

export const presentConfig = {
  desktop: {
    wordCount: 0,
    rotateDuration: [8, 20],
    density: {
      marginTop: [-40, 20],
      marginLeft: [6, 35]
    },
    wordFontSize: '20px',
    titleFontSize: '36px'
  },
  mobile: {
    wordCount: 0,
    rotateDuration: [8, 20],
    density: {
      marginTop: [-40, 40],
      marginLeft: [0, 40]
    },
    wordFontSize: '4vw',
    titleFontSize: '7vw'
  }
}

/**
 * 判断是否是移动端
 * 可用 url 参数 ?device=mobile / ?device=desktop 强制指定（方便在电脑上预览移动端效果）
 */
export const isMobile = () => {
  const device = new URLSearchParams(window.location.search).get('device')
  if (device === 'mobile') return true
  if (device === 'desktop') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
