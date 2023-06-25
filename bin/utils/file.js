const fs = require('fs')
const path = require('path')
const os = require('os')

/**
 * 获取绝对路径
 * @param {string} targetPath 目标路径
 * @returns
 */
const getAbsolutePath = (targetPath) => (targetPath.startsWith('/') ? targetPath : path.resolve(__dirname, targetPath))

/**
 * 创建一个文件夹，当上级目录不存在时，自动创建
 * 当前fs.mkdir只能基于上一层目录存在的情况下创建，否则报错
 * @params {string} dirPath 文件夹路径
 */
const mkdir = (dirPath) => {
  // 路径处理区分环境
  const isWindows = os.type() === 'Windows_NT'
  const dirArr = getAbsolutePath(dirPath)
    .split(isWindows ? '\\' : '/')
    .slice(1)
  dirArr.forEach(async (dir, index) => {
    const currentDir = `/${dirArr.slice(0, index + 1).join('/')}`
    if (!fs.existsSync(currentDir)) {
      fs.mkdirSync(currentDir)
    }
  })
}

/**
 * 将内容写入到文件中，当文件不存在时，创建该文件
 * fs.writeFileSync 的问题是，当文件的上级目录不存在时，则会报错
 * 此方法会当上级目录不存在时，依次创建上级目录
 * @param {string} filePath 文件路径
 */
const writeFile = (filePath, content, option = { flag: 'w+' }) => {
  const parentDirPath = path.dirname(filePath)
  !fs.existsSync(parentDirPath) && mkdir(parentDirPath)
  fs.writeFileSync(filePath, content, option)
}

/**
 * 写入package.json文件
 * @param {string} packagePath
 * @param {function} callback
 */
const writePackageJson = (packagePath, callback) => {
  const packageJson = require(packagePath)
  const newPackageJson = callback(packageJson)
  writeFile(packagePath, JSON.stringify(newPackageJson, null, 2))
}

/**
 * 批量移除指定文件
 */
const removeFiles = (files) => {
  const processDir = process.cwd()
  files.forEach((file) => {
    fs.unlinkSync(`${processDir}/${file}`)
  })
}

/**
 * 删除指定目录及目录下所有文件
 * @param {string} folderPath
 */
const removeDirectory = (folderPath) => {
  // 判断文件夹是否存在
  if (fs.existsSync(folderPath)) {
    // 读取文件夹下的文件目录，以数组形式输出
    fs.readdirSync(folderPath).forEach((file) => {
      // 拼接路径
      const curPath = path.join(folderPath, file)
      // 判断是不是文件夹，如果是，继续递归
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDirectory(curPath)
      } else {
        // 删除文件或文件夹
        fs.unlinkSync(curPath)
      }
    })
    // 仅可用于删除空目录
    fs.rmdirSync(folderPath)
  }
}

module.exports = { getAbsolutePath, writeFile, writePackageJson, removeFiles, removeDirectory }
