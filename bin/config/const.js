/**
 * lint相关配置所有依赖和文件
 */
const LINT_REGEXP = /eslint|stylelint|commitlint|prettier|babel|postcss/
const LINT_FILE_REGEXP = {
  commitlint: /^commitlint((\.(json|yaml|yml|js|cjs|ts|cts))|(\.config\.(js|cjs|ts|cts)))?$/,
  eslint: /^\.eslint((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  stylelint: /^\.stylelint((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  prettier: /^\.prettier((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  editor: /\.editorconfig/
}

module.exports = { LINT_REGEXP, LINT_FILE_REGEXP }
