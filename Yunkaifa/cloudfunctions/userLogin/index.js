const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command; // 引入数据库操作符

exports.main = async (event, context) => {
  const { phoneNumber, sessionKey } = event; // 从前端传入手机号和 sessionKey
  const userCollection = db.collection('user');

  try {
    // 检查用户是否已存在（通过手机号查询）
    const userRes = await userCollection.where({ phoneNumber }).get();
    
    if (userRes.data.length === 0) {
      // 首次登录：创建用户记录
      const addResult = await userCollection.add({
        data: {
          phoneNumber,
          openid: event.openid, // 从前端传入的 openid（通过 getOpenid 获取）
          sessionKey,
          loginStatus: 1, // 登录状态设为 1（已登录）
          createTime: db.serverDate() // 服务器时间
        }
      });
      return {
        code: 0,
        msg: "首次登录成功",
        data: { _id: addResult._id }
      };
    } else {
      // 非首次登录：更新登录状态和 sessionKey（可选）
      const updateResult = await userCollection.doc(userRes.data[0]._id).update({
        data: {
          loginStatus: 1,
          sessionKey: _.set(sessionKey), // 按需更新 sessionKey
          lastLoginTime: db.serverDate() // 更新最后登录时间
        }
      });
      return {
        code: 0,
        msg: "登录成功",
        data: { _id: userRes.data[0]._id }
      };
    }
  } catch (error) {
    return {
      code: -2,
      msg: "登录处理失败",
      error: error.message
    };
  }
};