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
  generateLintConfigs();
  // 生成.vscode/settings.json 文件
  generateVscodeSettings();
  // 生成.vscode/extensions.json 文件
  generateVscodeExtensions();
  // 添加lint相关的scripts
  addLintScripts();
  // 生成husky配置文件
  generateHuskyConfig();
  success("成功初始化Lint配置", spinner);
};

module.exports = {
  init,
};
