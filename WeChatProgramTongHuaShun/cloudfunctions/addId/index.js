// 云函数入口文件
import { init, database } from 'wx-server-sdk'

init() // 使用当前云环境
export async function main(event, context) {
  // 云函数入口函数
  try {
    const db = database()
    const collection = db.collection('idlist') // 获取集合实例
    const {
      key,
      value,
      
    } = event
    const res = await collection.add({
      data: {
        [key]: value,
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }

    })

    return {
      errCode: 0,
      errMsg: 添加成功,
      // 返回新添加的记录 ID
      recordId: res.id
    }
  } catch (error) {
    console.error(error)
    return {
      errCode: -1,
      errMsg: error
    }
  }
}