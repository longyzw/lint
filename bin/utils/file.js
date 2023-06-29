const fs = require('fs')
const path = require('path')
const os = require('os')
const ora = require('ora')
const { execSync } = require('child_process')
const { getProjectName, getAbsolutePath, getOptoinsContent, mergeObjects } = require('./utils')
const { _eslint, _stylelint, _gitHooks } = require('../config/lintConfig')
const { BASE_LINT, BASE_PRETTIER, BASE_STYLE, BASE_EDITOR, BASE_COMMIT } = require('../config/const')

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
 * @param {function} callback
 */
const writePackageJson = (callback) => {
  const packagePath = `${process.cwd()}/package.json`
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

/**
 * 筛选并安装插件
 * @param {array}  list 需要处理的数组
 * @param {string}  pkgValue 包管理器
 * @returns
 */
const setLintVersion = (list = [], pkgValue = 'pnpm') => {
  const lintVersion = require('../config/lintVersion')
  const allVersion = []
  // 筛选对应插件
  list.forEach((item) => {
    if (Reflect.has(lintVersion, item)) {
      const current = lintVersion[item]
      allVersion.push(...current.base)
      Object.entries(current).forEach(([k, v]) => {
        if (list.includes(k)) allVersion.push(...v)
      })
    }
  })

  console.log('安装以下依赖：', allVersion.join(' '))

  const spinner = ora('正在安装相关依赖，请稍等').start()

  try {
    execSync(`${pkgValue} i -D ${allVersion.join(' ')}`)
  } catch (error) {
    spinner.fail('依赖安装失败:', error)
    process.exit()
  }
  spinner.succeed('成功安装Lint相关依赖')
}

/**
 * 筛选生成对应文件
 * @param {array}  list 需要处理的数组
 * @returns
 */
const setLintFile = (list = []) => {
  // 生成editor配置文件
  writeFile(path.join(process.cwd(), '.editorconfig'), BASE_EDITOR)

  function getValue(data) {
    return list.filter((item) => Object.keys(data).includes(item))
  }

  // 生成对应配置文件
  const fileInfoList = [
    { name: '.prettierrc.js', methods: 'prettierConfig', value: '' },
    { name: '.eslintrc.js', methods: 'eslintConfig', value: getValue(_eslint) },
    { name: '.stylelintrc.js', methods: 'stylelintConfig', value: getValue(_stylelint) },
    { name: '.commitlintrc.js', methods: 'commitlintConfig', value: getValue(_gitHooks) }
  ]
  fileInfoList.forEach(({ name, methods, value }) => {
    writeFile(
      path.join(process.cwd(), name),
      `const { ${methods} } = require('${getProjectName()}/bin/utils/file')\n\nmodule.exports = ${methods}(${getOptoinsContent(
        value
      )})\n`
    )
  })
}

/**
 * 生成prettier配置文件
 * @param {object}  options 需要处理的配置
 * @returns object
 */
const prettierConfig = (options = {}) => {
  const { rules = {}, cover = {} } = options
  return {
    ...rules,
    ...BASE_PRETTIER,
    ...cover
  }
}

/**
 * 生成eslint配置文件
 * @param {object}  options 需要处理的配置
 * @returns object
 */
const eslintConfig = (options = {}) => {
  const { target = [], rules = {}, cover = {} } = options
  const baseConf = getConfig(BASE_LINT, target, _eslint)
  baseConf.rules = {
    ...rules,
    ...baseConf.rules,
    ...cover
  }
  return baseConf
}

/**
 * 生成stylelint配置文件
 * @param {object}  options 需要处理的配置
 * @returns object
 */
const stylelintConfig = (options = {}) => {
  const { target = [], rules = {}, cover = {} } = options
  const baseConf = getConfig(BASE_STYLE, target, _stylelint)
  baseConf.rules = {
    ...rules,
    ...baseConf.rules,
    ...cover
  }
  return baseConf
}

/**
 * 生成commitlint配置文件
 * @param {object}  options 需要处理的配置
 * @returns object
 */
const commitlintConfig = (options = {}) => {
  const { rules = {}, cover = {} } = options
  const baseConf = JSON.parse(JSON.stringify(BASE_COMMIT))
  baseConf.rules = {
    ...rules,
    ...baseConf.rules,
    ...cover
  }
  return baseConf
}

// 比较配置返回完整的配置结果
const getConfig = (base = {}, target = [], compare = {}) => {
  let baseConf = JSON.parse(JSON.stringify(base))
  target.forEach((item) => {
    baseConf = mergeObjects(baseConf || {}, compare[item] || {})
  })
  return baseConf
}

/**
 * 筛选生成对应package指令
 * @param {array}  list 需要处理的数组
 * @returns
 */
const setLintCommand = (list = []) => {
  const { eslint, stylelint } = require('../config/lintPackage')
  writePackageJson((packageJson) => {
    const eslintPattern = []
    const stylelintPattern = []
    list.forEach((item) => {
      eslintPattern.push(...(eslint.pattern[item] || []))
      stylelintPattern.push(...(stylelint.pattern[item] || []))
    })
    const { scripts = {} } = packageJson
    // 生成执行命令
    // scripts.preinstall = 'pnpm install'
    scripts['lint:show'] = `npx ${getProjectName()} show`
    scripts['lint:eslint'] = `eslint src --fix --ext ${eslintPattern.map((item) => '.' + item).join(',')}`
    scripts['lint:format'] = `prettier --write "src/**/*.{${eslintPattern.join(',')}}"`
    if (list.includes('stylelint')) {
      scripts['lint:stylelint'] = `stylelint --fix "src/**/*.{${stylelintPattern.join(',')}}"`
    }
    packageJson.scripts = scripts
    // 生成'lint-staged'配置
    const lintStaged = {
      [`*.{${eslintPattern.join(',')}}`]: 'npm run lint:eslint'
    }
    if (list.includes('stylelint')) {
      lintStaged[`*.{${stylelintPattern.join(',')}}`] = 'npm run lint:stylelint'
    }
    packageJson['lint-staged'] = lintStaged

    return packageJson
  })
}

module.exports = {
  writeFile,
  writePackageJson,
  removeFiles,
  removeDirectory,
  setLintVersion,
  setLintFile,
  prettierConfig,
  eslintConfig,
  stylelintConfig,
  commitlintConfig,
  setLintCommand
}
