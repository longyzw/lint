const path = require('path')

/**
 * lint相关配置所有依赖和文件
 */
const LINT_REGEXP = /eslint|stylelint|commitlint|prettier|babel|postcss/
const LINT_FILE_REGEXP = {
  commitlint: /^\.commitlint((rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  eslint: /^\.eslint((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  stylelint: /^\.stylelint((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  prettier: /^\.prettier((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  editor: /\.editorconfig/
}

/**
 * Husky相关文件配置
 */
const GIT_HOOKS_FILES = [
  {
    path: path.join(process.cwd(), `.husky/pre-commit`),
    content: `#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx lint-staged`
  },
  {
    path: path.join(process.cwd(), `.husky/commit-msg`),
    content: `#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx --no-install commitlint --edit "$1"`
  }
]

// 基础eslint配置
const BASE_LINT = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
    node: true
  },
  extends: ['standard'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: [],
  rules: {
    'import/no-extraneous-dependencies': 0
  },
  ignorePatterns: []
}

// 基础prettier配置
const BASE_PRETTIER = {
  printWidth: 120, // 一行最多多少字符
  tabWidth: 2, // 空格缩进
  useTabs: false, // 使用tab缩进
  semi: false, // 行尾需要分号
  singleQuote: true, // 使用单引号
  quoteProps: 'as-needed', // 对象的key仅在必要时使用引号
  jsxSingleQuote: false, // jsx使用单引号
  trailingComma: 'none', // 尾随逗号
  bracketSpacing: true, // 大括号内的收尾需要空格
  arrowParens: 'always', // 箭头函数，只有一个参数的时候，也需要括号
  // 每个文件格式化的范围
  rangeStart: 0,
  rangeEnd: Infinity,
  proseWrap: 'always', // 使用默认的折行标准
  htmlWhitespaceSensitivity: 'css', // 根据显示样式决定html要不要折行
  endOfLine: 'lf' // 换行符使用lf
}

// 基础stylelint配置
const BASE_STYLE = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  overrides: [],
  rules: {
    'import-notation': 'string', // @import 引入规则（主要是sass）
    'no-empty-source': null, // 禁止空源码
    'property-no-unknown': null, // 禁止未知的属性
    'custom-property-empty-line-before': null,
    'selector-class-pattern': null, // 强制选择器类名的格式
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['include', 'mixin', 'if', 'else', 'tailwind', 'apply', 'extend', 'content']
      }
    ],

    // 可规避
    'keyframes-name-pattern': null, // 动画名称规则
    'keyframe-block-no-duplicate-selectors': null, // 动画帧选择器重复
    'no-descending-specificity': null, // 修改类顺序来规避
    'no-duplicate-selectors': null, // 删除重复申明来规避
    'selector-pseudo-element-no-unknown': null, // 修改未知伪元素命名来规避
    'selector-id-pattern': null // 修改id命名来规避
  }
}

// 基础editor配置
const BASE_EDITOR = `# @see: http://editorconfig.org

root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
end_of_line = lf # 控制换行类型(lf | cr | crlf)
insert_final_newline = true # 始终在文件末尾插入一个新行
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
max_line_length = 120 # 最大行长度

[*.md] # 表示仅对 md 文件适用以下规则
max_line_length = off # 关闭最大行长度限制
trim_trailing_whitespace = false # 关闭末尾空格修剪
`

// 基础commit配置
const BASE_COMMIT = {
  extends: ['@commitlint/config-conventional'], // 检测规则
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

module.exports = {
  LINT_REGEXP,
  LINT_FILE_REGEXP,
  GIT_HOOKS_FILES,
  BASE_LINT,
  BASE_PRETTIER,
  BASE_STYLE,
  BASE_EDITOR,
  BASE_COMMIT
}
