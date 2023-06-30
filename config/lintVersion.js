module.exports = {
  eslint: {
    base: [
      'eslint@8.43.0',
      'eslint-config-standard@17.1.0',
      'eslint-plugin-import@2.27.5',
      'eslint-plugin-n@16.0.1',
      'eslint-plugin-promise@6.1.1',
      'prettier@2.8.8',
      'eslint-config-prettier@8.8.0',
      'eslint-plugin-prettier@4.2.1'
    ],
    vue2: ['eslint-plugin-vue@9.15.1'],
    vue3: ['eslint-plugin-vue@9.15.1'],
    typescript: ['typescript@5.0.2', '@typescript-eslint/eslint-plugin@5.60.0', '@typescript-eslint/parser@5.60.0']
  },
  stylelint: {
    base: [
      'stylelint@15.9.0',
      'stylelint-config-standard@33.0.0',
      'stylelint-order@6.0.3',
      'stylelint-prettier@3.0.0',
      'postcss@8.4.24',
      'postcss-html@1.5.0'
    ],
    vue2: ['stylelint-config-recommended-vue@1.4.0'],
    vue3: ['stylelint-config-recommended-vue@1.4.0'],
    sass: ['stylelint-config-standard-scss@9.0.0', 'postcss-scss@4.0.6'],
    less: ['stylelint-config-standard-less@1.0.0', 'postcss-less@6.0.0']
  },
  vite: {
    base: ['vite-plugin-eslint@1.8.1'],
    stylelint: ['vite-plugin-stylelint@4.3.0']
  },
  webpack: {
    base: []
  },
  gitHooks: {
    base: ['@commitlint/cli@17.6.6', '@commitlint/config-conventional@17.6.6', 'husky@8.0.3', 'lint-staged@13.2.2']
  }
}
