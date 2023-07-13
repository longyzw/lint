import { checkNodeEnv } from '../utils/check'

const clear = () => {
  console.log('清除')
  // 检测node环境
  if (!checkNodeEnv()) return
  console.log('开始清除文件')
}

const create = async () => {
  console.log('创建')
}

const update = () => {
  console.log('更新配置')
}

const show = async () => {
  console.log('查看')
}

export default { clear, create, update, show }
