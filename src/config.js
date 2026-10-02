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

const mobile = isMobile()

/**
 * 开场组件（Intro.vue）配置：
 * - letterLines  信纸打字机文案，从上往下依次打出，align 可选 left / center / right
 * - typeSpeed    打字速度：每个字符出现的间隔（ms）
 * - heartHint    爱心按钮上方的提示文案
 */
export const introConfig = {
  letterLines: [
    { text: 'Dear 生生', align: 'left' },
    { text: '    今晚，我将给你我所有的爱', align: 'left' },
    { text: 'Your 猫猫', align: 'right' }
  ],
  typeSpeed: 150,
  heartHint: '点击爱心领取，建议打开音量'
}

const titleFontSize = mobile ? '5vw' : ''
/**
 * 标题文案序列（Present 页中央文字）：
 * 每项依次以打字机效果输入（先顶行、后底行）→ 停留 → 播放下一项；
 * 最后一项播放完即停止，文字保留在屏幕上。
 * 停留时间：默认用下方公用的 holdTime，单项配置了 holdTime 则用该项自己的。
 */
export const titleConfig = {
  sequence: [
    // { top: 'Look at the stars', bottom: 'Look how they shine for you', topClass: 'final-text', bottomClass: 'final-text',holdTime: 1000 },
    { top: '你说过宇宙那么大，我们却那么渺小', bottom: '感觉离我们好远', fontSize: titleFontSize },
    { top: '其实在我看来', bottom: '宇宙其实是很浪漫的', fontSize: titleFontSize },
    { top: '当我眺望宇宙的时候', bottom: '能把我带到地球外，我就可以暂时忘记所有的问题', fontSize: titleFontSize },
    { top: '在时间层面下', bottom: '人类的寿命在宇宙下就是不值一提', fontSize: titleFontSize },
    { top: '所以就算如此', fontSize: titleFontSize },
    { top: '少年与爱永不老去', bottom: '即使披荆斩棘，丢失怒马鲜衣', fontSize: titleFontSize, holdTime: 6000 },
    { top: '囿于市井，面向星海', bottom: '不看楼笼灯火，看满天星光', fontSize: titleFontSize, holdTime: 6000 },
    { top: '如果说以后有一艘，船上只能坐两个人', bottom: '你愿意跟我一起去流浪吗？', fontSize: titleFontSize,holdTime: 8000 },
    { top: '今夜的星光将伴随着我们驶向远方'},
    { top: 'Look at the stars', bottom: 'Look how they shine for you' },
    { top: '今晚，整片星空将为我们而闪烁', topClass: 'final-text' }
  ],
  typeSpeed: 150, // 打字速度：每个字符出现的间隔（ms）
  holdTime: 4000  // 公用停留时间（ms）：每项打完后停留此时长再进入下一项
}

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
 * - appearInterval  诗句逐个出现的间隔（ms），0 表示全部立即出现
 *
 * 预览另一端效果可在 url 上加强制参数：?device=mobile 或 ?device=desktop
 */
export const presentConfig = {
  desktop: {
    wordCount: 0,
    rotateDuration: [8, 20],
    density: {
      marginTop: [-40, 20],
      marginLeft: [6, 35]
    },
    wordFontSize: '20px',
    titleFontSize: '36px',
    appearInterval: 200 // 诗句逐个出现的间隔（ms），0 = 全部立即出现
  },
  mobile: {
    wordCount: 0,
    rotateDuration: [8, 20],
    density: {
      marginTop: [-40, 40],
      marginLeft: [0, 40]
    },
    wordFontSize: '4vw',
    titleFontSize: '7vw',
    appearInterval: 700
  }
}