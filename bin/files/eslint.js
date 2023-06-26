module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
    node: true
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['prettier'],
  rules: {},
  ignorePatterns: []
}
