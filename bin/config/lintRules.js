// eslint相关规则
const eslintRules = {
  'import/no-extraneous-dependencies': 0
}

// prettier相关规则
const prettierRules = {
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

// typescript相关规则
const typescriptRules = {
  '@typescript-eslint/no-explicit-any': 0, // 禁止使用该 any 类型
  '@typescript-eslint/no-non-null-assertion': 0, // '!'不允许使用后缀运算符的非空断言
  '@typescript-eslint/ban-types': 1, // 禁止使用特定类型
  '@typescript-eslint/no-empty-function': 1, // 禁止使用空函数（prop默认值加括号规避）
  '@typescript-eslint/ban-ts-comment': 1 // （修改类型申明和写法规避）
}

// stylelint相关规则
const stylelintRules = {
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

// vue相关规则
const vueRules = {
  'vue/multi-word-component-names': 0, // 组件命名规范关闭校验
  // 可规避
  'vue/v-on-event-hyphenation': 1, // 事件连字符
  'vue/no-v-html': 1, // 禁止使用v-html（可通过插件vue-dompurify-html规避）
  'vue/no-side-effects-in-computed-properties': 1, // 禁止在计算属性中修改响应式对象值（可通过调用函数规避）
  'vue/prop-name-casing': 1,
  'vue/require-default-prop': 1, // prop需要默认值
  'vue/no-deprecated-v-on-native-modifier': 1, // 禁止弃用的native修饰符
  'vue/no-reserved-component-names': 1, // 禁止使用保留组件名（修改名称来规避）
  'vue/no-deprecated-slot-attribute': 1 // 禁止使用弃用插槽属性（修改插槽使用方式来规避）
}

module.exports = {
  eslintRules,
  prettierRules,
  typescriptRules,
  stylelintRules,
  vueRules
}
