const { getProjectName } = require('../utils')

module.exports = function Init() {
  console.log('安装配置')
  console.log('=getProjectName=', getProjectName())
}
