import { execSync } from 'node:child_process'

/**
 * 检查node环境 >= 16
 */
const checkNodeEnv = () => {
  const version = execSync('node -v')
  const versionNum = ~~version.toString().split('.')[0].split('v')[1]
  if (versionNum < 16) {
    console.error(`node版本${version}过低，请升级至16以上`)
    return false
  }
  return true
}

/**
 * 检查lint所属模块及配置文件
 */
const checkLintFile = () => {
  return {
    modules: [],
    values: []
  }
}

/**
 * 检查lint所属模块及依赖版本
 */
const checkLintPlugin = () => {
  return {
    modules: [],
    values: []
  }
}

export { checkNodeEnv, checkLintFile, checkLintPlugin }
