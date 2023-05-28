const inquirer = require('inquirer')
const path = require('path')
const { execSync } = require('child_process')
const chalk = require('chalk')
const { checkNodeEnv, removeFiles, success, loading, writeFileSync, deleteFolderRecursive } = require('./utils')
const { checkLintFile, checkLintPlugin, addLintScripts } = require('./helper')
const { INQUIER, PKG_MANAGE, LINT_PLUGINS, LINT_FILES, HUSKY_FILES, VSCODE_FILES } = require('./config')

// 清除依赖及配置文件
const clear = async () => {
  // 检测node环境
  if (!checkNodeEnv()) return
  // 检测lint配置文件
  const lintConfigList = checkLintFile()
  if (lintConfigList.length) {
    removeFiles(lintConfigList)
    success('成功移除Lint配置文件')
  }
  deleteFolderRecursive(path.join(process.cwd(), '/.husky'))
  deleteFolderRecursive(path.join(process.cwd(), '/.vscode'))
  // 检测lint相关依赖
  const lintPlugins = checkLintPlugin()
  if (lintPlugins.length) {
    const { iPkgManageType } = await inquirer.prompt([INQUIER.iPkgManageType])
    const spinner = loading('正在移除相关依赖...')
    execSync(`${PKG_MANAGE[iPkgManageType].remove} ${lintPlugins.join(' ')}`)
    success('成功移除Lint相关依赖', spinner)
  }
}

// 初始化配置文件
const init = async () => {
  // 检测node环境
  if (!checkNodeEnv()) return
  const { iPkgManageType } = await inquirer.prompt([INQUIER.iPkgManageType])

  // 安装lint相关依赖
  const spinner = loading('正在安装相关依赖...')
  execSync(`${PKG_MANAGE[iPkgManageType].add} -D ${LINT_PLUGINS.join(' ')}`)
  success('成功安装Lint相关依赖', spinner)

  // 生成lint配置文件
  LINT_FILES.map(item => writeFileSync(item.path, item.content))
  success('成功生成Lint配置文件')

  // 初始化git，防止git钩子函数关联报错
  execSync('git init')
  execSync('npx husky install')

  // 生成husky配置文件
  HUSKY_FILES.map(item => writeFileSync(item.path, item.content))
  success('成功生成Husky配置文件')

  // 生成.vscode配置文件
  VSCODE_FILES.map(item => writeFileSync(item.path, item.content))
  success('成功生成.vscode配置文件')

  // 添加lint相关执行脚本
  addLintScripts()
  success('成功添加lint相关执行脚本')

  console.log(chalk.green('>> 成功初始化Lint所有配置'))
}

const update = async () => {
  // 检测node环境
  if (!checkNodeEnv()) return
  // 更新配置
  console.log('相关功能后续再开发')
}

module.exports = {
  init,
  clear,
  update
}
