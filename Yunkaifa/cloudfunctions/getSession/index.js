const cloud = require('wx-server-sdk');
const axios = require('axios');


cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { code } = event;
  const appid = process.env.APPID;
  const secret = process.env.APPSECRET;

  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

  try {
    const res = await axios.get(url);
    const data = res.data;

    if (data.openid && data.session_key) {
      return {
        openid: data.openid,
        session_key: data.session_key
      };
    } else {
      return {
        error: '微信接口返回错误',
        detail: data
      };
    }
  } catch (err) {
    return {
      error: '请求失败',
      detail: err.toString()
    };
  }
};
