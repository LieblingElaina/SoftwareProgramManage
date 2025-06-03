const cloud = require('wx-server-sdk')
    
cloud.init()

exports.main = async (event, context) => {
  const { num1, num2 } = event;
  
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    return {
      success: false,
      message: '输入参数必须为数字',
      result: null
    };
  }

  const result = num1 + num2;
  
  return {
    success: true,
    message: '计算成功',
    result
  };
}