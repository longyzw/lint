#!/usr/bin/env node

import { Command } from 'commander'
import actions from './actions'

const program = new Command()

program
  .command('clear')
  .description('清除lint配置')
  .action(() => actions.clear())

program
  .command('create')
  .description('生成lint配置')
  .action(() => actions.create())

program
  .command('update')
  .description('更新lint配置')
  .action(() => actions.update())

program
  .command('show')
  .description('查看lint配置')
  .action(() => actions.show())

program.parse()
