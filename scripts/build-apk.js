/**
 * 一键打包 APK：npm run apk
 *
 * 流程：vite 构建 → 同步 dist 到安卓工程 → gradle 出 debug APK
 * 依赖本机工具链（首次已自动配置好）：
 *   JDK 21       ~\.cache\build-tools\jdk21        （Capacitor 7 要求）
 *   Android SDK  ~\.cache\build-tools\android-sdk
 */
import { spawnSync } from 'child_process'
import os from 'os'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const androidDir = path.join(root, 'android')
const apkPath = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')

// gradle 需要的工具链环境
const env = {
  ...process.env,
  JAVA_HOME: path.join(os.homedir(), '.cache', 'build-tools', 'jdk21'),
  ANDROID_HOME: path.join(os.homedir(), '.cache', 'build-tools', 'android-sdk')
}

/** 顺序执行一步，失败即中止 */
const run = (name, cmd, args, cwd = root) => {
  console.log(`\n[${name}] ${cmd} ${args.join(' ')}`)
  const r = spawnSync(cmd, args, { cwd, env, stdio: 'inherit', shell: true })
  if (r.status !== 0) {
    console.error(`\n✗ ${name} 失败（退出码 ${r.status}）`)
    process.exit(r.status ?? 1)
  }
}

run('1/3 web 构建', 'npm', ['run', 'build'])
run('2/3 同步到安卓工程', 'npx', ['cap', 'sync', 'android'])
run('3/3 gradle 打包', process.platform === 'win32' ? 'gradlew.bat' : './gradlew', ['assembleDebug'], androidDir)

const size = (fs.statSync(apkPath).size / 1024 / 1024).toFixed(1)
console.log(`\n✓ 打包完成（${size} MB）`)
console.log(`  ${apkPath}`)
