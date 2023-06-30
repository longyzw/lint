module.exports = {
  _eslint: {
    prettier: {
      extends: ['plugin:prettier/recommended'],
      plugins: ['prettier']
    },
    vue2: {
      extends: ['plugin:vue/recommended'],
      parser: 'vue-eslint-parser',
      plugins: ['vue'],
      rules: {
        'vue/multi-word-component-names': 0, // 组件命名规范关闭校验
        'vue/v-on-event-hyphenation': 1, // 事件连字符
        'vue/no-v-html': 0, // 禁止使用v-html（可通过插件vue-dompurify-html规避）
        'vue/no-side-effects-in-computed-properties': 1, // 禁止在计算属性中修改响应式对象值（可通过调用函数规避）
        'vue/prop-name-casing': 1,
        'vue/require-default-prop': 0, // prop需要默认值
        'vue/no-deprecated-v-on-native-modifier': 1, // 禁止弃用的native修饰符
        'vue/no-reserved-component-names': 1, // 禁止使用保留组件名（修改名称来规避）
        'vue/no-deprecated-slot-attribute': 1 // 禁止使用弃用插槽属性（修改插槽使用方式来规避）
      }
    },
    vue3: {
      extends: ['plugin:vue/vue3-strongly-recommended'],
      parser: 'vue-eslint-parser',
      plugins: ['vue'],
      rules: {
        'vue/multi-word-component-names': 0, // 组件命名规范关闭校验
        'vue/v-on-event-hyphenation': [
          'warn',
          'always',
          {
            autofix: true,
            ignore: []
          }
        ], // 事件连字符
        'vue/no-v-html': 0, // 禁止使用v-html（可通过插件vue-dompurify-html规避）
        'vue/no-side-effects-in-computed-properties': 1, // 禁止在计算属性中修改响应式对象值（可通过调用函数规避）
        'vue/prop-name-casing': 1,
        'vue/require-default-prop': 0, // prop需要默认值
        'vue/no-deprecated-v-on-native-modifier': 1, // 禁止弃用的native修饰符
        'vue/no-reserved-component-names': 1, // 禁止使用保留组件名（修改名称来规避）
        'vue/no-deprecated-slot-attribute': 1 // 禁止使用弃用插槽属性（修改插槽使用方式来规避）
      }
    },
    typescript: {
      extends: ['plugin:@typescript-eslint/recommended'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaFeatures: {
          tsx: true
        }
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-explicit-any': 0, // 禁止使用该 any 类型
        '@typescript-eslint/no-non-null-assertion': 0, // '!'不允许使用后缀运算符的非空断言
        '@typescript-eslint/no-empty-function': 0, // 禁止使用空函数（prop默认值加括号规避）
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            varsIgnorePattern: '^_|APP_VERSION|SENTRY_ENABLE',
            argsIgnorePattern: '^_'
          }
        ]
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
      extends: ['stylelint-config-recommended-vue'],
      overrides: [
        {
          files: ['*.vue', '*.html'],
          customSyntax: 'postcss-html'
        }
      ]
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
      extends: ['stylelint-config-standard-scss'],
      rules: {
        'scss/dollar-variable-pattern': null,
        'scss/at-mixin-pattern': null
      }
    },
    less: {
      extends: ['stylelint-config-standard-less']
    }
  },
  _gitHooks: {},
  _vsCode: {
    extensions: {
      vue2: {
        recommendations: ['Vue.volar']
      },
      vue3: {
        recommendations: ['Vue.volar']
      },
      stylelint: {
        recommendations: ['stylelint.vscode-stylelint']
      }
    },
    settings: {
      stylelint: {
        'editor.codeActionsOnSave': {
          'source.fixAll.stylelint': true
        },
        'stylelint.validate': ['css', 'html', 'postcss']
      },
      typescript: {
        'eslint.validate': ['typescript']
      },
      sass: {
        'eslint.validate': ['scss'],
        'stylelint.validate': ['scss']
      },
      vue2: {
        'eslint.validate': ['vue'],
        'stylelint.validate': ['vue']
      },
      vue3: {
        'eslint.validate': ['vue'],
        'stylelint.validate': ['vue']
      }
    }
  }
}
