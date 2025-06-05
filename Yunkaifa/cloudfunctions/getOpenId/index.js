const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 自动获取当前云环境

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext(); // 获取微信上下文（含 openid）
    return {
      code: 0,
      data: {
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID
      },
      msg: "获取 openid 成功"
    };
  } catch (error) {
    return {
      code: -1,
      msg: "获取 openid 失败",
      error: error.message
    };
  }
};