// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-2g44zeqaf2265de9'
})
const db = cloud.database()
const _ = db.command

// 云函数名：checkFavorite
export async function main(event, context) {
  try {
    // 从事件对象中获取传入的ID
    const favoriteId = event.favoriteId
    // 查询数据库，判断ID是否存在于收藏列表中
    const res = await db.collection('idlist').where({
      // 假设你的收藏列表字段名是favoriteIds，且是一个数组类型
      id: _.in([favoriteId])
    }).get()

    // 根据查询结果判断ID是否存在
    if (res.data.length > 0) {
      // ID存在
      return {
        exists: true
      }
    } else {
      // ID不存在
      return {
        exists: false
      }
    }
  } catch (err) {
    // 查询出错，返回错误信息
    console.error(err)
    return err
  }
}