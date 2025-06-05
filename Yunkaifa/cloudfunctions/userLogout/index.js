const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { phoneNumber } = event; // 从前端传入手机号
  const userCollection = db.collection('user');

  try {
    // 更新用户登录状态为 0
    const updateResult = await userCollection.where({ phoneNumber }).update({
      data: {
        loginStatus: 0,
        logoutTime: db.serverDate() // 记录退出时间
      }
    });
    if (updateResult.stats.updated === 0) {
      return {
        code: -3,
        msg: "退出失败：用户不存在"
      };
    }
    return {
      code: 0,
      msg: "退出登录成功"
    };
  } catch (error) {
    return {
      code: -4,
      msg: "退出处理失败",
      error: error.message
    };
  }
};