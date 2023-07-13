const LINT_PLUGIN = {
  eslint2: /^\.eslintrc\.(js|cjs|yaml|yml|json)$/,
  eslint: [
    // 匹配 .eslintrc.{js,cjs,yaml,yml,json}
    /^\.eslintrc\.(js|cjs|yaml|yml|json)$/,
    // 匹配 .babelrc | .babelrc.{json,js,cjs,mjs,cts}
    /\.(babelrc)(\.(json|js|cjs|mjs|cts))?/,
    // 匹配 babel.config.{json,js,cjs,mjs,cts}
    /^babel\.config\.(json|js|cjs|mjs|cts)$/
  ],
  stylelint: [
    // 匹配 .stylelintrc | .stylelintrc.{cjs,js,json,yaml,yml}
    /\.(stylelintrc)(\.(cjs|js|json|yaml|yml))?/,
    // 匹配 stylelint.config.{cjs,mjs,js}
    /^stylelint\.config\.(cjs|mjs|js)$/
  ],
  prettier: /^\.eslintrc\.(yaml|yml)$/,
  commitlint: /^\.eslintrc\.(yaml|yml)$/
}

export { LINT_PLUGIN }
