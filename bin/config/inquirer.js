const inquirer = require('inquirer')

// 选择包管理器
const pkgChoice = async () => {
  const { pkgValue } = await inquirer.prompt([
    {
      type: 'list',
      name: 'pkgValue',
      default: 'pnpm',
      message: '选择包管理器',
      choices: [
        { value: 'npm', name: 'npm' },
        { value: 'pnpm', name: 'pnpm' }
      ]
    }
  ])
  return pkgValue
}

// 选择lint规则
const lintChoice = async () => {
  const lintList = ['eslint', 'prettier']
  // 选择框架
  const { frame } = await inquirer.prompt([
    {
      type: 'list',
      name: 'frame',
      message: '选择框架',
      choices: [
        { value: 'vue3', name: 'Vue3' },
        { value: 'vue2', name: 'Vue2' },
        { value: '', name: 'None' }
      ]
    }
  ])
  if (frame) lintList.push(frame)
  // 选择脚手架
  const { scaffolding } = await inquirer.prompt([
    {
      type: 'list',
      name: 'scaffolding',
      message: '选择脚手架',
      choices: [
        { value: 'vite', name: 'Vite' },
        { value: 'webpack', name: 'webpack' },
        { value: '', name: 'None' }
      ]
    }
  ])
  if (scaffolding) lintList.push(scaffolding)
  // 是否启用ts
  const { ts } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'ts',
      message: '是否包含typescript ?'
    }
  ])
  if (ts) lintList.push('typescript')
  // 是否使用stylelint及相关样式预处理器
  const { stylelint, css } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'stylelint',
      message: '是否使用stylelint ?'
    },
    {
      type: 'checkbox',
      name: 'css',
      message: '选择预处理器',
      choices: ['sass'],
      when: function (answers) {
        // 当watch为true的时候才会提问当前问题
        return answers.stylelint
      }
    }
  ])
  if (stylelint) lintList.push('stylelint')
  if (css?.length) lintList.push(...css)
  // 是否启用git hooks
  const { gitHooks } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'gitHooks',
      message: '是否启用git hooks: pre-commit + commit-msg ?'
    }
  ])
  if (gitHooks) lintList.push('gitHooks')
  return lintList
}

module.exports = {
  pkgChoice,
  lintChoice
}
