module.exports = {
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
