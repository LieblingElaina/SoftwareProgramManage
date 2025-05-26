function formatNumber(num, decimals = 2) {
    if (isNaN(num)) return '--';
    
    // 处理负数
    const isNegative = num < 0;
    num = Math.abs(num);
    
    // 四舍五入
    const factor = Math.pow(10, decimals);
    let rounded = Math.round(num * factor) / factor;
    
    // 转换为字符串处理
    let parts = rounded.toString().split('.');
    
    // 整数部分
    let integer = parts[0];
    
    // 小数部分
    let fraction = parts[1] || '';
    if (fraction.length < decimals) {
      fraction += '0'.repeat(decimals - fraction.length);
    } else if (fraction.length > decimals) {
      fraction = fraction.substring(0, decimals);
    }
    
    // 组合结果
    let result = integer + '.' + fraction;
    if (isNegative) result = '-' + result;
    
    return result;
  }
  
  // 导出函数
  module.exports = {
    formatNumber
  };