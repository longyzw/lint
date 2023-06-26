const { checkNodeEnv } = require('../utils/check')
const { loading, success, setInitLintConfif } = require('./../utils')
const { pkgChoice, lintChoice } = require('./../config/inquirer')

module.exports = async function Init() {
  // 检测node环境
  if (!checkNodeEnv()) return false

  // 选择要搭配的lint规则
  const lintInfo = await lintChoice()
  console.log('--1=', lintInfo)
  setInitLintConfif(lintInfo)

  const pkgValue = await pkgChoice()
  console.log('---==', pkgValue)

  const spinner = loading('正在生成配置及文件')

  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve()
  //   }, 1000)
  // })
  success('成功生成Lint配置及文件', spinner)
}
