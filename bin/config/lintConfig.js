module.exports = {
  prettier: {
    extends: ['standard', 'plugin:prettier/recommended'],
    plugins: ['prettier']
  },
  vue2: {},
  vue3: {
    extends: ['plugin:vue/vue3-strongly-recommended'],
    parser: 'vue-eslint-parser',
    plugins: ['vue']
  },
  typescript: {
    extends: ['plugin:@typescript-eslint/recommended'],
    parserOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        tsx: true,
        jsx: true
      }
    },
    plugins: ['@typescript-eslint']
  },
  stylelint: {
    extends: ['stylelint-config-standard', 'stylelint-config-prettier']
  },
  vite: {},
  webpack: {},
  sass: {
    extends: ['stylelint-config-standard-scss@9.0.0']
  }
}
