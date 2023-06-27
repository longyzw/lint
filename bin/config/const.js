const path = require('path')

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

module.exports = { LINT_REGEXP, LINT_FILE_REGEXP, GIT_HOOKS_FILES }
