/**
 * commitlint预设
 **/
const COMMITLINT_PRESETS = {
  configRegexp: /^commitlint((\.(json|yaml|yml|js|cjs|ts|cts))|(\.config\.(js|cjs|ts|cts)))?$/,
  // 包含 commitlint 的正则表达式
  dependenciesRegexp: /commitlint/
}

/**
 * eslint配置文件名正则表达式
 **/
const ESLINT_PRESETS = {
  configRegexp: /^\.eslint((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  dependenciesRegexp: /eslint/
}

/**
 * stylelint配置文件名正则表达式
 **/
const STYLELINT_PRESETS = {
  configRegexp: /^\.stylelint((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  dependenciesRegexp: /stylelint/
}

/**
 * prettier配置文件名正则表达式
 **/
const PRETTIER_PRESETS = {
  configRegexp: /^\.prettier((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  dependenciesRegexp: /prettier/
}

/**
 * 依赖
 */
const LINT_DEPENDENCIES = [
  ...[
    '@commitlint/cli',
    '@commitlint/config-conventional',
  ],
  ...[
    "typescript",
    "@types/eslint",
    "@types/node",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "vue-tsc",
  ],
  ...[
    "eslint",
    "eslint-config-prettier",
    "eslint-import-resolver-alias",
    "eslint-plugin-prettier",
    "eslint-plugin-vue",
    "vite-plugin-eslint",
    "prettier"
  ],
  ...[
    "stylelint",
    "stylelint-config-recess-order",
    "stylelint-config-recommended-scss",
    "stylelint-config-recommended-vue",
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-prettier",
    "vite-plugin-stylelint",
    "postcss",
    "postcss-html"
  ]
]

/**
 * lint相关的所有依赖
 */
const ALL_LINT_DEPENDENCIES_REGEXP = new RegExp(
  [
    ESLINT_PRESETS.dependenciesRegexp.source,
    STYLELINT_PRESETS.dependenciesRegexp.source,
    COMMITLINT_PRESETS.dependenciesRegexp.source,
    PRETTIER_PRESETS.dependenciesRegexp.source
  ].join('|')
)

/**
 * VSCode插件Map
 */
const VSCODE_EXTENSIONS = {
  eslint: 'ESLint',
  stylelint: 'Stylelint',
  prettier: 'Prettier - Code formatter'
}

module.exports = {
  COMMITLINT_PRESETS,
  ESLINT_PRESETS,
  STYLELINT_PRESETS,
  PRETTIER_PRESETS,
  LINT_DEPENDENCIES,
  ALL_LINT_DEPENDENCIES_REGEXP,
  VSCODE_EXTENSIONS
};
