const { execSync } = require('child_process')
const fs = require('fs')
const chalk = require('chalk')
const { LINT_REGEXP, LINT_FILE_REGEXP } = require('./../config')

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
  return true
}

/**
 * 检测lint配置文件
 * return LintConfigList
 */
const checkLintFile = () => {
  // 获取当前项目下文件列表
  const processDir = process.cwd()
  const fileList = fs.readdirSync(processDir)
  const LintConfigList = [] // 已经安装的lint工具配置文件列表
  Object.values(LINT_FILE_REGEXP).forEach((reg) => {
    const configs = fileList.filter((item) => reg.test(item))
    if (configs.length) {
      LintConfigList.push(...configs)
    }
  })
  return LintConfigList
}

/**
 * 检测package.json文件中lint相关依赖
 * return lintPlugins
 */
const checkLintPlugin = () => {
  const packageJson = require(`${process.cwd()}/package.json`)
  const { dependencies = {}, devDependencies = {}, optionalDependencies = {} } = packageJson
  const pluginList = [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
    ...Object.keys(optionalDependencies)
  ]
  const lintPlugins = pluginList.filter((item) => LINT_REGEXP.test(item))
  return lintPlugins
}

module.exports = { checkNodeEnv, checkLintFile, checkLintPlugin }
