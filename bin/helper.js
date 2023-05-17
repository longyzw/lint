const path = require("path");
const { execSync, exec } = require("child_process");
const {
  getProcessDir,
  getFileListInDir,
  filterReg,
  getPackageJsonPath,
  writeFileSync,
  getAbsolutePath,
} = require("./utils");
const {
  ESLINT_PRESETS,
  STYLELINT_PRESETS,
  COMMITLINT_PRESETS,
  PRETTIER_PRESETS,
  LINT_DEPENDENCIES,
  ALL_LINT_DEPENDENCIES_REGEXP,
} = require("./constant");

/**
 * 检查node环境 >= 16
 */
const checkNodeEnv = () => {
  const version = execSync("node -v");
  const versionNum = version.toString().split(".")[0].split("v")[1];
  console.log("nodeVersoin:", versionNum);
  if (versionNum < 16) {
    console.log(chalk.red("node版本过低，请升级至16以上"));
    return false;
  }
  return true;
};

/**
 * 检查lint环境是否已经安装
 * return { installedLintName, installedLintConfigList }
 */
const checkLintEnv = () => {
  const processDir = getProcessDir();
  const fileList = getFileListInDir(processDir);
  const eslintConfigs = filterReg(fileList, ESLINT_PRESETS.configRegexp);
  const stylelintConfigs = filterReg(fileList, STYLELINT_PRESETS.configRegexp);
  const commitlintConfigs = filterReg(
    fileList,
    COMMITLINT_PRESETS.configRegexp
  );
  const prettierConfigs = filterReg(fileList, PRETTIER_PRESETS.configRegexp);

  const installedLintName = []; // 已经安装的lint工具名
  const installedLintConfigList = []; // 已经安装的lint工具配置文件列表
  if (eslintConfigs.length > 0) {
    installedLintName.push("ESLint");
    installedLintConfigList.push(...eslintConfigs);
  }
  if (stylelintConfigs.length > 0) {
    installedLintName.push("StyleLint");
    installedLintConfigList.push(...stylelintConfigs);
  }
  if (commitlintConfigs.length > 0) {
    installedLintName.push("CommitLint");
    installedLintConfigList.push(...commitlintConfigs);
  }
  if (prettierConfigs.length > 0) {
    installedLintName.push("Prettier");
    installedLintConfigList.push(...prettierConfigs);
  }

  return {
    installedLintName,
    installedLintConfigList,
  };
};

/**
 * 移除package.json文件中dependencies中的lint相关依赖
 */
const removeLintDependencies = () => {
  const packagePath = getPackageJsonPath();
  writePackageJson(packagePath, (packageJson) => {
    const {
      dependencies = {},
      devDependencies = {},
      optionalDependencies = {},
      scripts = {},
    } = packageJson;
    const dependenciesList = [
      ...Object.keys(dependencies),
      ...Object.keys(devDependencies),
      ...Object.keys(optionalDependencies),
    ];
    const lintDependencies = filterReg(
      dependenciesList,
      ALL_LINT_DEPENDENCIES_REGEXP
    );
    lintDependencies.forEach((item) => {
      delete dependencies[item];
      delete devDependencies[item];
      delete optionalDependencies[item];
    });
    scripts["prepare"] && delete scripts["prepare"];
    return packageJson;
  });
};

/**
 * 写入package.json文件
 * @param {string} packagePath
 * @param {function} callback
 */
const writePackageJson = (packagePath, callback) => {
  const packageJson = require(packagePath);
  const newPackageJson = callback(packageJson);
  writeFileSync(packagePath, JSON.stringify(newPackageJson, null, 2));
};

/**
 * 根据目标环境安装lint相关依赖
 */
const installLintDependencies = async () => {
  // 根据lint要素得到lint的所有依赖
  const lintDependencies = LINT_DEPENDENCIES;

  // 检查 husky、lint-staged 是否已经安装
  const [isInstalledHusky, isInstalledLintStaged] = checkInstalledPackage([
    "husky",
    "lint-staged",
  ]);
  !isInstalledHusky && lintDependencies.push("husky");
  !isInstalledLintStaged && lintDependencies.push("lint-staged");

  // 根据dependencies获取最新版本号
  const latestLintDependencies = await getLatestLintDependencies(
    lintDependencies
  );
  // 将lint依赖写入package.json
  addLintDependencies(latestLintDependencies);

  // 检查删除prepare脚本
  const packageJsonPath = getPackageJsonPath();
  const { scripts = {} } = require(packageJsonPath);
  scripts.prepare && execSync("npm pkg delete scripts.prepare");

  // 执行npm install
  execSync("npm install");

  setPackageJsonSettings([{ "scripts.prepare": "husky install" }]);
  execSync("npm run prepare");
};

/**
 * 检查指定package是否已安装在package.json的dependencies中
 * @param {string[]} packageNames 依赖列表, 例如 ['husky', 'lint-stage']
 * @returns {boolean[]} 依赖是否已安装列表
 */
const checkInstalledPackage = (packageNames) => {
  const packagePath = getPackageJsonPath();
  const {
    dependencies = {},
    devDependencies = {},
    optionalDependencies = {},
  } = require(packagePath);
  const dependenciesList = [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
    ...Object.keys(optionalDependencies),
  ];
  return packageNames.map((item) => dependenciesList.includes(item));
};

/**
 * 根据依赖列表获取依赖的版本号
 */
const getLatestLintDependencies = async (dependencies) => {
  const dependenciesList = [];
  const promiseList = dependencies.map(
    (item) =>
      new Promise((resolve) => {
        exec(`npm view ${item} version`, (err, stdout) => {
          if (err) {
            console.error(err);
          }
          resolve(stdout.toString().trim());
        });
      })
  );
  const latestVersions = await Promise.all(promiseList);
  dependencies.forEach((item, index) => {
    dependenciesList.push(`${item}@^${latestVersions[index]}`);
  });

  return dependenciesList;
};

/**
 * 添加dependencies到package.json文件的devDependencies中, 并排序
 * @param {string[]} dependencies 依赖列表, 例如 ['eslint@^8.39.0', 'prettier@^2.8.8']
 */
const addLintDependencies = (dependencies) => {
  const packagePath = getPackageJsonPath();
  writePackageJson(packagePath, (packageJson) => {
    const { devDependencies = {} } = packageJson;
    dependencies.forEach((item) => {
      const [name, version] = item.split("@^");
      devDependencies[`${name}`] = `^${version}`;
    });
    packageJson.devDependencies = sortDependencies(devDependencies);
    return packageJson;
  });
};

/**
 * 排序dependencies
 */
const sortDependencies = (dependencies) => {
  const dependenciesList = Object.keys(dependencies);
  const sortedDependencies = {};
  dependenciesList.sort().forEach((item) => {
    sortedDependencies[item] = dependencies[item];
  });
  return sortedDependencies;
};

/**
 * 设置package.json的配置
 * @param {string|string[]} settings [{key: value}, {key: value}]
 */
const setPackageJsonSettings = (settings) => {
  if (Array.isArray(settings)) {
    let setting = "";
    settings.forEach((item) => {
      setting += `${Object.keys(item)[0]}="${Object.values(item)[0]}" `;
    });
    execSync(`npm pkg set ${setting.trim()}`);
  }
};

/**
 * 根据lintTarget批量生成lint配置文件到项目的根目录
 * @param {string}
 */
const generateLintConfigs = () => {
  const lintTarget = ["eslint", "stylelint", "commitlint", "prettier"];
  // 获取当前项目名称
  const projectName = getProjectName();
  const processDir = getProcessDir();
  lintTarget.forEach((item) => {
    const fileName =
      item === "commitlint" ? "commitlint.config.cjs" : `.${item}rc.cjs`;
    const lintConfigPath = path.join(processDir, fileName);

    const content = `
    const config = require('${projectName}/config/${item}')

    module.exports = config({})
    `;
    writeFileSync(lintConfigPath, content);

    if (item === "commitlint") return;
    const lintIgnorePath = path.join(processDir, `.${item}ignore`);
    const ignoreContent = require(`./../config/${item}/ignore`);

    writeFileSync(lintIgnorePath, ignoreContent);
  });

  const tsConfigPath = path.join(processDir, `tsconfig.json`);
  const tsNodePath = path.join(processDir, `tsconfig.node.json`);
  writeFileSync(tsConfigPath, JSON.stringify(require('./../config/ts/index.json'), null, 2));
  writeFileSync(tsNodePath, JSON.stringify(require('./../config/ts/node.json'), null, 2));
};

/**
 * 获取当前项目名称
 * @returns {string} 项目名称
 */
const getProjectName = () => {
  const currentPackageJsonPath = getAbsolutePath("../package.json");
  const { name } = require(currentPackageJsonPath);
  return name;
};

/**
 * .vscode/settings.json文件
 * 这里为固定内容，包含了eslint、prettier、stylelint等配置
 */
const generateVscodeSettings = () => {
  const processDir = getProcessDir();
  const settingsPath = path.join(processDir, ".vscode/settings.json");
  const settingsContent = {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
      "source.fixAll.stylelint": true,
    },
    "eslint.validate": ["javascript", "typescript", "vue"],
    "stylelint.validate": ["css", "scss", "vue", "html", "postcss"],
  };
  writeFileSync(settingsPath, JSON.stringify(settingsContent, null, 2));
};

/**
 * .vscode/extensions.json文件
 * 这里为固定内容，包含了校验需要依赖的插件配置
 */
const generateVscodeExtensions = () => {
  const processDir = getProcessDir();
  const extensionsPath = path.join(processDir, ".vscode/extensions.json");
  const extensionsContent = {
    "recommendations": [
      "Vue.volar",
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "stylelint.vscode-stylelint"
    ]
  };
  writeFileSync(extensionsPath, JSON.stringify(extensionsContent, null, 2));
};

/**
 * 添加lint执行脚本到package.json文件的scripts中，以及 lint-staged配置
 */
const addLintScripts = () => {
  const packagePath = getPackageJsonPath();
  writePackageJson(packagePath, (packageJson) => {
    const { scripts = {}, "lint-staged": lintStaged = {} } = packageJson;

    scripts["lint:eslint"] =
      "vue-tsc --noEmit && eslint . --ext .vue,.js,.jsx,.cjs,.ts,.tsx --fix --ignore-path .eslintignore";
    scripts["lint:css"] = "stylelint **/*.{vue,css,sass,scss} --fix";
    lintStaged["*.{js,vue,ts}"] = "npm run lint:eslint";
    lintStaged["*.{vue,css,scss,sass}"] = "npm run lint:css";
    scripts["prepare"] = "husky install";

    packageJson.scripts = scripts;
    packageJson["lint-staged"] = lintStaged;
    return packageJson;
  });
};

/**
 * 生成husky配置文件
 */
const generateHuskyConfig = () => {
  const processDir = getProcessDir();
  const preCommitPath = path.join(processDir, ".husky/pre-commit");
  const commitMsgPath = path.join(processDir, ".husky/commit-msg");
  // 创建 pre-commit 和 commit-msg 内容
  const preCommitContent = `#!/usr/bin/env sh
  . "$(dirname -- "$0")/_/husky.sh"
  
  npx lint-staged`;
  const commitMsgContent = `#!/usr/bin/env sh
  . "$(dirname -- "$0")/_/husky.sh"
  
  npx --no-install commitlint --edit "$1"`;

  // 内容覆盖
  writeFileSync(preCommitPath, preCommitContent);
  writeFileSync(commitMsgPath, commitMsgContent);
};

module.exports = {
  checkNodeEnv,
  checkLintEnv,
  removeLintDependencies,
  installLintDependencies,
  generateLintConfigs,
  generateVscodeSettings,
  generateVscodeExtensions,
  addLintScripts,
  generateHuskyConfig,
};
