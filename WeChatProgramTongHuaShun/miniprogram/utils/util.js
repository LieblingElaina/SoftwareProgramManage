// 格式化数字，使其显示为两位数
const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
}

// 格式化日期时间
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
}

// 格式化时间戳
const formatTimestamp = timestamp => {
  const date = new Date(timestamp);
  return formatTime(date);  // 使用formatTime来格式化日期
}

module.exports = {
  formatTime,
  formatTimestamp  // 导出新增的formatTimestamp函数
}
