const { execSync } = require('child_process')
const chalk = require('chalk')
const ora = require('ora')
const { getAbsolutePath } = require('./file')

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
 * 检查node环境 >= 16
 */
const checkNodeEnv = () => {
  const version = execSync('node -v')
  const versionNum = ~~version.toString().split('.')[0].split('v')[1]
  if (versionNum < 16) {
    console.log(chalk.red(`node版本${version}过低，请升级至16以上`))
    return false
  }
  success(`node环境验证成功, ${version}`)
  return true
}

/**
 * 获取当前项目名称
 * @returns {string} 项目名称
 */
const getProjectName = () => {
  const currentPackageJsonPath = getAbsolutePath('../../package.json')
  const { name } = require(currentPackageJsonPath)
  return name
}

module.exports = { loading, success, checkNodeEnv, getProjectName }
