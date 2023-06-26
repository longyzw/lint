const path = require('path')
const { success, removeLintFile, removeLintPlugin } = require('./../utils')
const { checkNodeEnv } = require('./../utils/check')
const { removeDirectory } = require('../utils/file')

module.exports = async function Clear() {
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
