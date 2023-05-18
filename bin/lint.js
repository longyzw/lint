const inquirer = require("inquirer");
const {
  checkNodeEnv,
  checkLintEnv,
  removeLintDependencies,
  installLintDependencies,
  generateLintConfigs,
  generateVscodeSettings,
  generateVscodeExtensions,
  addLintScripts,
  generateHuskyConfig,
} = require("./helper");
const { removeFiles } = require("./utils");
const { loading, success } = require("./loading");

const init = async () => {
  console.log("使用lint插件初始化配置");
  // 检查node环境
  const isNodeEnvOk = checkNodeEnv();
  if (!isNodeEnvOk) return;

  // 检查Lint的配置文件是否已存在
  const { installedLintName, installedLintConfigList } = checkLintEnv();

  // 当配置文件已存在时，询问是否覆盖
  if (installedLintName.length > 0) {
    const { isOverride } = await inquirer.prompt([
      {
        type: "confirm",
        name: "isOverride",
        message: `已存在${installedLintName.join("、")}配置，是否覆盖？`,
      },
    ]);
    if (!isOverride) {
      console.log("\n已取消初始化");
      return;
    }

    const spinner = loading("正在移除已存在Lint配置...");
    // 当配置文件已存在时，移除已存在的配置文件与依赖
    removeFiles(installedLintConfigList);
    removeLintDependencies();
    success("成功移除已存在的Lint配置", spinner);
  }

  const spinner = loading("正在初始化Lint配置...");
  // 安装依赖
  await installLintDependencies();
  // 生成配置文件
  const spinner2 = loading("正在生成配置文件...");
  generateLintConfigs();
  success("成功生成配置文件", spinner2);
  const spinner3 = loading("正在生成项目vs code配置...");
  // 生成.vscode/settings.json 文件
  generateVscodeSettings();
  // 生成.vscode/extensions.json 文件
  generateVscodeExtensions();
  success("成功生成vs code配置", spinner3);
  const spinner4 = loading("正在生成脚本配置...");
  // 添加lint相关的scripts
  addLintScripts();
  // 生成husky配置文件
  generateHuskyConfig();
  success("成功生成所有配置", spinner4);
  success("成功初始化Lint配置", spinner);
};

module.exports = {
  init,
};
