const { checkNodeEnv } = require('../utils/check')
const { loading, success } = require('./../utils')

module.exports = async function Init() {
  // 检测node环境
  if (!checkNodeEnv()) return false
  const spinner = loading('正在生成配置及文件')
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 3000)
  })
  success('成功生成Lint配置及文件', spinner)
}
