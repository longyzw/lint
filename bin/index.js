#!/usr/bin/env node

const { Command } = require('commander')
const { Clear, Create, Update } = require('./lint')

const program = new Command()

program
  .command('clear')
  .description('清除lint配置')
  .action(() => Clear())

program
  .command('create')
  .description('生成lint配置')
  .action(() => Create())

program
  .command('update')
  .description('更新lint配置')
  .action(() => Update())

program.parse()
