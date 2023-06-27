const path = require('path')
const { success, removeLintFile, removeLintPlugin, setInitLintConfig } = require('./utils')
const { checkNodeEnv } = require('./utils/check')
const { removeDirectory } = require('./utils/file')
const { pkgChoice, lintChoice } = require('./config/inquirer')

const Clear = () => {
  // 检测node环境
  if (!checkNodeEnv()) return false
  // 移除lint配置文件
  removeLintFile()
  // 移除lint相关依赖
  removeLintPlugin()
  // 移除husky和vscode文件配置
  removeDirectory(path.join(process.cwd(), '/.husky'))
  removeDirectory(path.join(process.cwd(), '/.vscode'))
  success('成功移除Lint配置及文件')
}

const Create = async () => {
  // 检测node环境
  if (!checkNodeEnv()) return false

  // 选择要搭配的lint规则
  const lintInfo = await lintChoice()
  const pkgValue = await pkgChoice()
  setInitLintConfig(lintInfo, pkgValue)
  success('成功生成Lint配置及文件')
}

const Update = () => {
  console.log('更新配置')
}

module.exports = {
  Clear,
  Create,
  Update
}
