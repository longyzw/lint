#!/usr/bin/env node

const { Command } = require('commander');
const Lint = require('./lint')

const program = new Command()

program
    .command('init')
    .description('初始化lint配置')
    .action(() => {
        Lint.init()
    })

program
    .command('clear')
    .description('清除lint配置')
    .action(() => {
        Lint.clear()
    })

program
    .command('update')
    .description('更新lint配置')
    .action(() => {
        Lint.update()
    })


program.parse()
