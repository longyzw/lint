const ora = require('ora')
const fs = require('fs')
const { execSync } = require('child_process')
const { checkLintFile } = require('./check')
const {
  removeFiles,
  writePackageJson,
  writeFile,
  setLintVersion,
  setLintFile,
  setLintCommand,
  setVscodeFile
} = require('./file')
const { LINT_ORDER, LINT_REGEXP, GIT_HOOKS_FILES } = require('../config/const')

/**
 * 脚本执行过程中的loading效果
 */
const loading = (text) => ora(text).start()

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
 * @returns
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
 * @param {array} list 需要处理的数组
 * @returns {array} 处理完后的数组
 */
const sortLintItem = (list = []) => {
  const newList = []
  LINT_ORDER.forEach((item) => {
    if (list.includes(item)) newList.push(item)
  })
  return newList
}

/**
 * 生成lint相关配置
 * @param {array}  list 需要处理的数组
 * @param {string}  pkgValue 包管理器
 * @returns
 */
const setInitLintConfig = (list = [], pkgValue = 'pnpm') => {
  const newList = sortLintItem(list)
  // 筛选安装对应插件
  const allVersion = setLintVersion(newList, pkgValue)
  // 筛选生成对应文件
  setLintFile(newList)
  // 生成package.json配置
  setLintCommand(newList)
  // 生成vacode的配置文件
  if (newList.includes('vscode')) {
    setVscodeFile(newList)
    // 检查git忽略文件设置vscode相关配置
    const path = `${process.cwd()}/.gitignore`
    let content = ''
    try {
      content = fs.readFileSync(path, 'utf-8')
    } catch (e) {
      content = 'node_modules'
    }
    const vscodeConfig = ['.vscode/*', '!.vscode/extensions.json', '!.vscode/settings.json']
    const newContent = content.split('\n').filter((item) => item.indexOf('.vscode') === -1)
    newContent.push(...vscodeConfig)
    writeFile(path, newContent.join('\n'))
  }
  if (newList.includes('gitHooks')) {
    // 初始化git，防止git钩子函数关联报错
    execSync('git init')
    execSync('npx husky install')
    // 生成husky配置文件
    GIT_HOOKS_FILES.map((item) => writeFile(item.path, item.content))
  }
  console.log('安装以下依赖：', allVersion.join(' '))

  const spinner = ora('正在安装相关依赖，请稍等').start()
  try {
    execSync(`${pkgValue} i -D ${allVersion.join(' ')}`)
  } catch (error) {
    spinner.fail('依赖安装失败:', error)
    process.exit()
  }
  spinner.succeed('成功安装Lint相关依赖')
}

module.exports = {
  loading,
  removeLintFile,
  removeLintPlugin,
  sortLintItem,
  setInitLintConfig
}
