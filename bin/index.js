const { Command } = require('commander')
const { Clear, Init, Update } = require('./lint')

const program = new Command()

program
  .command('clear')
  .description('清除lint配置')
  .action(() => Clear())

program
  .command('init')
  .description('初始化lint配置')
  .action(() => Init())

program
  .command('update')
  .description('更新lint配置')
  .action(() => Update())

program.parse()
