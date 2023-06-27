const ora = require('ora')
const path = require('path')

/**
 * 脚本执行过程中的loading效果
 */
const loading = (text) => ora(text).start()
/**
 * 脚本执行完成关闭loading效果
 */
const success = (text, spinner = '') => {
  spinner ? spinner.succeed(text) : ora(text).succeed()
}

/**
 * 获取绝对路径
 * @param {string} targetPath 目标路径
 * @returns
 */
const getAbsolutePath = (targetPath) => (targetPath.startsWith('/') ? targetPath : path.resolve(__dirname, targetPath))

/**
 * 获取当前项目名称
 * @returns {string} 项目名称
 */
const getProjectName = () => {
  const currentPackageJsonPath = getAbsolutePath('../../package.json')
  const { name } = require(currentPackageJsonPath)
  return name
}

module.exports = { loading, success, getProjectName, getAbsolutePath }
