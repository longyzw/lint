module.exports = (rules = {}) => ({
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended-vue",
    "stylelint-config-recess-order",
    "stylelint-prettier/recommended",
  ],
  overrides: [
    {
      files: ["*.scss", "**/*.scss"],
      customSyntax: "postcss-scss",
      extends: ["stylelint-config-recommended-scss"],
    },
  ],
  rules: {
    ...rules,
    "import-notation": "string", // @import 引入规则（主要是sass）
    "no-empty-source": null, // 禁止空源码
    "property-no-unknown": null, // 禁止未知的属性
    "custom-property-empty-line-before": null,
    "selector-class-pattern": null, // 强制选择器类名的格式
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["include", "mixin", "if", "else"],
      },
    ],

    // 可规避
    "keyframes-name-pattern": null, // 动画名称规则
    "keyframe-block-no-duplicate-selectors": null, // 动画帧选择器重复
    "no-descending-specificity": null, // 修改类顺序来规避
    "no-duplicate-selectors": null, // 删除重复申明来规避
    "selector-pseudo-element-no-unknown": null, // 修改未知伪元素命名来规避
    "selector-id-pattern": null, // 修改id命名来规避
  },
});
