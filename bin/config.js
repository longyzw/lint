const path = require("path");
const { getProjectName } = require("./utils");

/**
 * lint相关配置所有依赖和文件
 */
const LINT_REGEXP = /eslint|stylelint|commitlint|prettier|babel|postcss/;
const LINT_FILE_REGEXP = {
  commitlint:
    /^commitlint((\.(json|yaml|yml|js|cjs|ts|cts))|(\.config\.(js|cjs|ts|cts)))?$/,
  eslint:
    /^\.eslint((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  stylelint:
    /^\.stylelint((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  prettier:
    /^\.prettier((ignore)|(rc\.(json|yaml|yml|js|cjs|ts|cts))|(rc\.config\.(js|cjs|ts|cts)))?$/,
  editor: /\.editorconfig/,
};

/**
 * inquier相关配置
 */
const INQUIER = {
  // 是否清除配置
  isClearConf: {
    type: "confirm",
    name: "isClearConf",
    message: `已存在 Lint 相关配置，是否清除？`,
  },
  // 包管理器
  iPkgManageType: {
    type: "list",
    name: "iPkgManageType",
    message: "请选择一个包管理器进行后续操作?",
    choices: [
      { value: "npm", name: "npm" },
      { value: "pnpm", name: "pnpm" },
    ],
  },
};

/**
 * 包管理器配置
 */
const PKG_MANAGE = {
  npm: {
    add: "npm i ",
    remove: "npm uninstall ",
  },
  pnpm: {
    add: "pnpm i ",
    remove: "pnpm remove ",
  },
};

/**
 * Lint相关依赖及版本号
 */
const LINT_PLUGINS = [
  ...[
    "typescript@5.0.2",
    "@types/eslint@8.37.0",
    "@types/node@20.1.1",
    "@typescript-eslint/eslint-plugin@5.59.5",
    "@typescript-eslint/parser@5.59.5",
    "vue-tsc@1.4.2",
  ],
  ...[
    "eslint@8.40.0",
    "eslint-config-prettier@8.8.0",
    "eslint-import-resolver-alias@1.1.2",
    "eslint-plugin-prettier@4.2.1",
    "eslint-plugin-vue@9.11.1",
    "vite-plugin-eslint@1.8.1",
    "prettier@2.8.8",
  ],
  ...[
    "stylelint@15.6.1",
    "stylelint-config-recess-order@4.0.0",
    "stylelint-config-recommended-scss@11.0.0",
    "stylelint-config-recommended-vue@1.4.0",
    "stylelint-config-standard@33.0.0",
    "stylelint-config-standard-scss@9.0.0",
    "stylelint-prettier@3.0.0",
    "vite-plugin-stylelint@4.3.0",
    "postcss@8.4.23",
    "postcss-html@1.5.0",
  ],
  ...[
    "husky@8.0.3",
    "lint-staged@13.2.2",
    "@commitlint/cli@17.6.3",
    "@commitlint/config-conventional@17.6.3",
  ],
];

/**
 * Lint相关文件配置
 */
const LINT_FILES = [
  ...["eslint", "prettier", "stylelint"]
    .map((item) => {
      return [
        {
          path: path.join(process.cwd(), `.${item}rc.cjs`),
          content: `const config = require('${getProjectName()}/config/${item}')\n\nmodule.exports = config({})\n`,
        },
        {
          path: path.join(process.cwd(), `.${item}ignore`),
          content: require(`./../config/${item}/ignore`),
        },
      ];
    })
    .flat(Infinity),
  {
    path: path.join(process.cwd(), "commitlint.config.cjs"),
    content: `module.exports = {\n  extends: [require.resolve('${getProjectName()}/config/commitlint')],\n  rules: {}\n}\n`,
  },
  {
    path: path.join(process.cwd(), ".editorconfig"),
    content: require(`./../config/editor`),
  },
];

/**
 * Husky相关文件配置
 */
const HUSKY_FILES = [
  {
    path: path.join(process.cwd(), `.husky/pre-commit`),
    content: `#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx lint-staged`,
  },
  {
    path: path.join(process.cwd(), `.husky/commit-msg`),
    content: `#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx --no-install commitlint --edit "$1"`,
  },
];

/**
 * .vscode相关文件配置
 */
const VSCODE_FILES = [
  {
    path: path.join(process.cwd(), `.vscode/settings.json`),
    content: JSON.stringify(
      {
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": true,
          "source.fixAll.stylelint": true,
        },
        "eslint.validate": ["javascript", "typescript", "vue"],
        "stylelint.validate": ["css", "scss", "vue", "html", "postcss"],
      },
      null,
      2
    ),
  },
  {
    path: path.join(process.cwd(), `.vscode/extensions.json`),
    content: JSON.stringify(
      {
        recommendations: [
          "Vue.volar",
          "dbaeumer.vscode-eslint",
          "esbenp.prettier-vscode",
          "stylelint.vscode-stylelint",
        ],
      },
      null,
      2
    ),
  },
];

module.exports = {
  LINT_REGEXP,
  LINT_FILE_REGEXP,
  INQUIER,
  PKG_MANAGE,
  LINT_PLUGINS,
  LINT_FILES,
  HUSKY_FILES,
  VSCODE_FILES,
};
