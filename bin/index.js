#!/usr/bin/env node

const { Command } = require('commander')
const Lint = require('./lint')

const program = new Command()

program
    .command('init')
    .description('init lint for vue project')
    .action(() => {
        Lint.init()
    })

program
    .command('clear')
    .description('clear config and script')
    .action(() => {
        Lint.clear()
    })

program.parse()
