const { checkNodeEnv, success } = require('../utils')

module.exports = function Init() {
  // 检测node环境
  if (!checkNodeEnv()) return false
}
