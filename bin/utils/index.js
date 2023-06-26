const ora = require('ora')
const { getAbsolutePath } = require('./file')
const { checkLintFile } = require('./check')
const { removeFiles, writePackageJson } = require('./file')
const { LINT_REGEXP } = require('../config/const')

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
 * 获取当前项目名称
 * @returns {string} 项目名称
 */
const getProjectName = () => {
  const currentPackageJsonPath = getAbsolutePath('../../package.json')
  const { name } = require(currentPackageJsonPath)
  return name
}

/**
 * 移除lint相关文件
 * @returns {boolean} true
 */
const removeLintFile = () => {
  const files = checkLintFile()
  if (files.length) removeFiles(files)
  return true
}

/**
 * 移除lint相关插件及脚本
 * @returns {boolean} true
 */
const removeLintPlugin = () => {
  writePackageJson((packageJson) => {
    // 移除相关插件
    const checkList = ['dependencies', 'devDependencies', 'optionalDependencies']
    checkList.forEach((item) => {
      if (packageJson[item]) {
        Object.keys(packageJson[item]).forEach((m) => {
          if (LINT_REGEXP.test(m)) delete packageJson[item][m]
        })
      }
    })
    // 移除相关脚本
    Object.entries(packageJson?.scripts || {}).forEach(([k, v]) => {
      if (['lint', 'prettier', 'stylelint', 'style'].find((item) => k.indexOf(item) > -1)) {
        delete packageJson.scripts[k]
      }
      if (['build', 'deploy'].find((item) => k.indexOf(item) > -1)) {
        packageJson.scripts[k] = v.replace('vue-tsc --noEmit &&', '').replace('vue-tsc &&', '').trim()
      }
    })
    return packageJson
  })
}

module.exports = { loading, success, getProjectName, removeLintFile, removeLintPlugin }
