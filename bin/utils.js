const path = require("path");
const fs = require("fs");
const os = require('os')

/**
 * 目标数组中是否包含子数组的所有元素
 * @param {*} target
 * @param {*} sub
 */
const isIncludeArray = (target, sub) =>
  sub.every((item) => target.includes(item));

/**
 * 获取进程当前执行的目录
 */
const getProcessDir = () => process.cwd();

/**
 * 获取文件夹下的所有文件名列表
 * @param {string} dirPath 文件夹路径
 */
const getFileListInDir = (dirPath) => {
  const dir = fs.readdirSync(dirPath);
  return dir;
};

/**
 * 目标数组中是否存在满足指定正则表达式的元素，存在则返回所有匹配的元素，不存在则返回空数组
 * @param {*} target
 * @param {*} reg
 * @returns {Array}
 */
const filterReg = (target, reg) => target.filter((item) => reg.test(item));

/**
 * 批量移除指定文件
 */
const removeFiles = (files) => {
  const processDir = getProcessDir();
  files.forEach((file) => {
    const filePath = `${processDir}/${file}`;
    fs.unlinkSync(filePath);
  });
};

/**
 * 获取安装项目的package.json文件路径
 * @returns {string}
 */
const getPackageJsonPath = () => `${getProcessDir()}/package.json`;

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
 * 获取绝对路径
 * @param {string} targetPath 目标路径
 * @returns
 */
const getAbsolutePath = (targetPath) =>
  targetPath.startsWith("/") ? targetPath : path.resolve(__dirname, targetPath);

/**
 * 检查文件是否在指定目录下
 * @param {string} filePath 文件路径
 * @param {string} dirPath 目录路径
 * @returns {boolean}
 */
const isExistFileInDir = (fileName, dir) => fs.existsSync(`${dir}/${fileName}`);

/**
 * 将内容写入到文件中，当文件不存在时，创建该文件
 * fs.writeFileSync 的问题是，当文件的上级目录不存在时，则会报错
 * 此方法会当上级目录不存在时，依次创建上级目录
 * 与writeFileSync不同的是，此方法写入时将流定位到文件末尾
 * @param {string} filePath 文件路径
 */
const appendFileSync = (filePath, content, option = { flag: "a" }) => {
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
  const isWindows = os.type() === 'Windows_NT'
    const dirArr = getAbsolutePath(dirPath).split(isWindows ? '\\' : '/')
      .slice(1)
    dirArr.forEach(async (dir, index) => {
      const currentDir = `/${dirArr.slice(0, index + 1).join('/')}`
      if (!fs.existsSync(currentDir)) {
        fs.mkdirSync(currentDir)
      }
    })
  }

module.exports = {
  isIncludeArray,
  getProcessDir,
  getFileListInDir,
  filterReg,
  removeFiles,
  getPackageJsonPath,
  writeFileSync,
  getAbsolutePath,
  isExistFileInDir,
  appendFileSync,
};
