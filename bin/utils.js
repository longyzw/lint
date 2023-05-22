const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const ora = require("ora");
const chalk = require("chalk");
const os = require("os");

/**
 * 脚本执行过程中的loading效果
 */
const loading = (text) => ora(text).start();
/**
 * 脚本执行完成关闭loading效果
 */
const success = (text, spinner = "") => {
  spinner ? spinner.succeed(text) : ora(text).succeed();
};

/**
 * 检查node环境 >= 16
 */
const checkNodeEnv = () => {
  const version = execSync("node -v");
  const versionNum = ~~version.toString().split(".")[0].split("v")[1];
  if (versionNum < 16) {
    console.log(chalk.red(`node版本${version}过低，请升级至16以上`));
    return false;
  }
  success(`node环境验证成功, ${version}`);
  return true;
};

/**
 * 批量移除指定文件
 */
const removeFiles = (files) => {
  const processDir = process.cwd();
  files.forEach((file) => {
    fs.unlinkSync(`${processDir}/${file}`);
  });
};

/**
 * 将内容写入到文件中，当文件不存在时，创建该文件
 * fs.writeFileSync 的问题是，当文件的上级目录不存在时，则会报错
 * 此方法会当上级目录不存在时，依次创建上级目录
 * @param {string} filePath 文件路径
 */
const writeFileSync = (filePath, content, option = { flag: "w+" }) => {
  const parentDirPath = path.dirname(filePath);
  !fs.existsSync(parentDirPath) && mkdir(parentDirPath);
  fs.writeFileSync(filePath, content, option);
};

/**
 * 创建一个文件夹，当上级目录不存在时，自动创建
 * 当前fs.mkdir只能基于上一层目录存在的情况下创建，否则报错
 * @params {string} dirPath 文件夹路径
 */
const mkdir = (dirPath) => {
  // 路径处理区分环境
  const isWindows = os.type() === "Windows_NT";
  const dirArr = getAbsolutePath(dirPath)
    .split(isWindows ? "\\" : "/")
    .slice(1);
  dirArr.forEach(async (dir, index) => {
    const currentDir = `/${dirArr.slice(0, index + 1).join("/")}`;
    if (!fs.existsSync(currentDir)) {
      fs.mkdirSync(currentDir);
    }
  });
};

/**
 * 获取绝对路径
 * @param {string} targetPath 目标路径
 * @returns
 */
const getAbsolutePath = (targetPath) =>
  targetPath.startsWith("/") ? targetPath : path.resolve(__dirname, targetPath);

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
 * 删除指定目录及目录下所有文件
 * @param {string} folderPath
 */
const deleteFolderRecursive = (folderPath) => {
  //判断文件夹是否存在
  if (fs.existsSync(folderPath)) {
    //读取文件夹下的文件目录，以数组形式输出
    fs.readdirSync(folderPath).forEach((file) => {
      //拼接路径
      const curPath = path.join(folderPath, file);
      //判断是不是文件夹，如果是，继续递归
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        //删除文件或文件夹
        fs.unlinkSync(curPath);
      }
    });
    //仅可用于删除空目录
    fs.rmdirSync(folderPath);
  }
};

module.exports = {
  checkNodeEnv,
  loading,
  success,
  removeFiles,
  writeFileSync,
  getProjectName,
  writePackageJson,
  deleteFolderRecursive,
};
