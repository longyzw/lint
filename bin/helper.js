const fs = require("fs");
const { LINT_FILE_REGEXP, LINT_REGEXP } = require("./config");
const { writePackageJson } = require('./utils')

/**
 * 检测lint配置文件
 * return LintConfigList
 */
const checkLintFile = () => {
  // 获取当前项目下文件列表
  const processDir = process.cwd();
  const fileList = fs.readdirSync(processDir);
  const LintConfigList = []; // 已经安装的lint工具配置文件列表
  Object.values(LINT_FILE_REGEXP).map((reg) => {
    const configs = fileList.filter((item) => reg.test(item));
    if (configs.length) {
        LintConfigList.push(...configs);
    }
  });
  return LintConfigList
};

/**
 * 检测package.json文件中lint相关依赖
 * return lintPlugins
 */
const checkLintPlugin = () => {
  const packageJson = require(`${process.cwd()}/package.json`)
  const { dependencies = {}, devDependencies = {}, optionalDependencies = {} } = packageJson
  const pluginList = [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
    ...Object.keys(optionalDependencies),
  ]
  const lintPlugins = pluginList.filter((item) => LINT_REGEXP.test(item))
  return lintPlugins
}

/**
 * 添加lint执行脚本到package.json文件的scripts中，以及 lint-staged配置
 */
const addLintScripts = () => {
  const packagePath = `${process.cwd()}/package.json`
  writePackageJson(packagePath, packageJson => {
    const { scripts = {} } = packageJson
    // 删除相似功能脚本配置
    Object.entries(scripts).map(([k, v]) => {
      if (['lint', 'prettier', 'stylelint', 'style'].find(item => k.indexOf(item) > -1)) {
        delete scripts[k]
      }
      if (['build', 'deploy'].find(item => k.indexOf(item) > -1)) {
        scripts[k] = v.replace('vue-tsc --noEmit &&', '').replace('vue-tsc &&', '').trim()
      }
    })
    scripts['lint:eslint'] =
      'vue-tsc --noEmit && eslint . --ext .vue,.js,.jsx,.cjs,.ts,.tsx --fix --ignore-path .eslintignore'
    scripts['lint:css'] = 'stylelint **/*.{vue,css,sass,scss} --fix'

    packageJson.scripts = scripts
    packageJson['lint-staged'] = {
      '*.{js,vue,ts}': 'npm run lint:eslint',
      '*.{vue,css,scss,sass}': 'npm run lint:css'
    }
    return packageJson
  })
}

module.exports = {
  checkLintFile,
  checkLintPlugin,
  addLintScripts,
};
