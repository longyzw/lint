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

/**
 * 重新排序lint选项处理顺序
 * @param {array} []
 * @returns {array} []
 */
const sortLintItem = (list = []) => {
  const baseOrder = ['eslint', 'vue2', 'vue3', 'typescript', 'stylelint', 'sass', 'prettier', 'gitHooks']
  const newList = []
  baseOrder.forEach((item) => {
    if (list.includes(item)) newList.push(item)
  })
  return newList
}

/**
 * 移除lint相关文件
 * @param {array} []
 * @returns {boolean} true
 */
const setInitLintConfif = (list = []) => {
  const newList = sortLintItem(list)
  const lintVersion = require('./../config/lintVersion')
  const allVersion = []
  newList.forEach((item) => {
    if (Reflect.has(lintVersion, item)) {
      const current = lintVersion[item]
      allVersion.push(...current.base)
      Object.entries(current).forEach(([k, v]) => {
        if (newList.includes(k)) allVersion.push(...v)
      })
    }
  })
  console.log('----', allVersion)
  return true
}

module.exports = { loading, success, getProjectName, removeLintFile, removeLintPlugin, sortLintItem, setInitLintConfif }
