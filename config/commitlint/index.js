module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'type-enum': [
      2,
      'always',
      [
        // 新功能或功能变更相关
        'feat',
        // 修复bug相关
        'fix',
        // 改动了文档，注释相关
        'docs',
        // 修改了代码格式化相关，如删除空格、改变缩进、单双引号切换、增删分号等，并不会影响代码逻辑
        'style',
        // 重构代码，代码结构的调整相关（理论上不影响现有功能）
        'refactor',
        // 性能改动，性能、页面等优化相关
        'perf',
        // 增加或更改测试用例，单元测试相关
        'test',
        // 影响编译的更改相关，比如打包路径更改、npm过程更改等
        'build',
        // 其它改动相关，比如文件的删除、构建流程修改、依赖库工具更新增加等
        'chore',
        // 回滚版本相关
        'revert',
        // 持续集成方面的更改。现在有些build系统喜欢把ci功能使用yml描述。如有这种更改，建议使用ci
        'ci'
      ]
    ]
  }
}
