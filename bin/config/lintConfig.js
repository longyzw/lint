module.exports = {
  _eslint: {
    prettier: {
      extends: ['plugin:prettier/recommended'],
      plugins: ['prettier']
    },
    vue2: {
      extends: ['plugin:vue/recommended'],
      // overrides: [
      //   {
      //     files: ['*.vue'],
      //     extends: ['plugin:vue/recommended'],
      //     parser: 'vue-eslint-parser'
      //   }
      // ],
      plugins: ['vue']
    },
    vue3: {
      extends: ['plugin:vue/vue3-recommended'],
      parser: 'vue-eslint-parser',
      // overrides: [
      //   {
      //     files: ['*.vue'],
      //     extends: ['plugin:vue/vue3-recommended'],
      //     parser: 'vue-eslint-parser'
      //   }
      // ],
      plugins: ['vue'],
      rules: {
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
    },
    typescript: {
      // parser: '@typescript-eslint/parser',
      // overrides: [
      //   {
      //     files: ['*.ts'],
      //     extends: ['plugin:@typescript-eslint/recommended'],
      //     parser: '@typescript-eslint/parser'
      //   }
      // ],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaFeatures: {
          tsx: true
        }
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-explicit-any': 0, // 禁止使用该 any 类型
        '@typescript-eslint/no-non-null-assertion': 0, // '!'不允许使用后缀运算符的非空断言
        '@typescript-eslint/ban-types': 1, // 禁止使用特定类型
        '@typescript-eslint/no-empty-function': 1, // 禁止使用空函数（prop默认值加括号规避）
        '@typescript-eslint/ban-ts-comment': 1 // （修改类型申明和写法规避）
      }
    },
    vite: {},
    webpack: {}
  },
  _stylelint: {
    prettier: {
      extends: ['stylelint-prettier/recommended'],
      plugins: ['stylelint-prettier'],
      rules: {
        'prettier/prettier': true
      }
    },
    vue2: {
      extends: ['stylelint-config-recommended-vue']
    },
    vue3: {
      extends: ['stylelint-config-recommended-vue'],
      overrides: [
        {
          files: ['*.vue', '*.html'],
          customSyntax: 'postcss-html'
        }
      ]
    },
    vite: {},
    webpack: {},
    sass: {
      extends: ['stylelint-config-standard-scss']
    },
    less: {
      extends: ['stylelint-config-standard-less']
    }
  },
  _gitHooks: {}
}
