// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init() // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const db = cloud.database()
    const collection = db.collection('adddata') // 从事件对象中获取集合名称
    const { key, value } = event // 从事件对象中获取要删除的键和值

    // 查询并删除文档
    const res = await collection.where({
      [key]: value
    }).remove()

    // 返回操作结果
    return {
      errCode: res.errCode,
      errMsg: res.errMsg,
      // 可以根据需要返回更多信息，比如被删除的文档ID等
    }
  } catch (error) {
    // 发生错误时返回错误信息
    console.error(error)
    return {
      errCode: -1, // 自定义一个错误码
      errMsg: error.message || 删除过程中发生错误
    }
  }


}