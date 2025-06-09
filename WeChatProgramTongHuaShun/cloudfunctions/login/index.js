const cloud = require('wx-server-sdk')
const request = require('request');

cloud.init({
    env: 'cloud1-2g44zeqaf2265de9'
  }) // 使用当前云环境
const db = cloud.database()
const users = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  const appid = 'wx5aae21fa382ce4cf'; 
  const secret = '7131d7d1c4c5e128a9f922eb8843490f'; 
  const code = event.code

  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
  try {
    let data = await new Promise((resolve, reject) => {
      request({ url: url, json: true }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          resolve(body);
        } else {
          reject(error || body);
        }
      });
    });
    let { data: user } = await users.where({
      phone: event.phone
    }).get()
    if (user[0]) {
      await users.where({_id: user[0]._id,})
        .update({data: {...data, login_status: 1}})
    } else {
      await users.add({data: {phone: event.phone,...data,login_status: 1}})
    }
    return {
      success: true
    }
  } catch (err) {
    console.log(err)
    return {
      success: false
    }
  }
}