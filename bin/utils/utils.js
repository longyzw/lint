const ora = require('ora')
const path = require('path')

/**
 * 脚本执行过程中的loading效果
 */
const loading = (text) => ora(text).start()
/**
 * 脚本执行完成关闭loading效果
 */
const success = (text, spinner = '') => {
  spinner ? spinner.succeed(text) : ora(text).succeed()
}

/**
 * 获取绝对路径
 * @param {string} targetPath 目标路径
 * @returns
 */
const getAbsolutePath = (targetPath) => (targetPath.startsWith('/') ? targetPath : path.resolve(__dirname, targetPath))

/**
 * 获取当前项目名称
 * @returns {string} 项目名称
 */
const getProjectName = () => {
  const currentPackageJsonPath = getAbsolutePath('../../package.json')
  const { name } = require(currentPackageJsonPath)
  return name
}

/**
 * 处理optionsContent
 * @param {string | object} value 目标选项匹配
 * @returns {object} lint规则配置结构
 */
const getOptoinsContent = (value = '') => {
  const result = {
    target: value,
    rules: {},
    cover: {}
  }
  if (!(Array.isArray(value) && value.length)) delete result.target
  return JSON.stringify(result, null, 2)
}
/**
 * 对象合并
 * @param {value} target 目标选项匹配
 * @returns {object} 合并过后的对象
 */
const mergeObjects = (obj1, obj2) => {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    // 如果其中一个参数不是对象，则返回其中一个参数
    return obj1
  }

  const merged = {}

  // 合并第一个对象的属性
  for (const key in obj1) {
    if (Reflect.has(obj1, key)) {
      merged[key] = mergeObjects(obj1[key], obj2[key])
    }
  }

  // 合并第二个对象的属性
  for (const key in obj2) {
    if (Reflect.has(obj2, key)) {
      // 如果第一个对象没有相同的属性，则将其复制到合并后的对象中
      if (!Reflect.has(obj1, key)) {
        merged[key] = obj2[key]
      } else if (Array.isArray(obj2[key])) {
        // 如果属性是数组，则将第二个对象的数组与第一个对象的数组合并
        merged[key] = obj1[key].concat(obj2[key])
      }
    }
  }

  return merged
}

module.exports = { loading, success, getProjectName, getAbsolutePath, getOptoinsContent, mergeObjects }
