const { checkNodeEnv } = require('../utils/check')
const { success, setInitLintConfig } = require('../utils')
const { pkgChoice, lintChoice } = require('../config/inquirer')

module.exports = async function Init() {
  // 检测node环境
  if (!checkNodeEnv()) return false

  // 选择要搭配的lint规则
  const lintInfo = await lintChoice()
  const pkgValue = await pkgChoice()
  setInitLintConfig(lintInfo, pkgValue)
  success('成功生成Lint配置及文件')
}
