// utils/api.js
function fetchStocks(url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'GET',
      success: function(res) {
        if (res.statusCode === 200 && res.data && res.data.result && res.data.result.data) {
          resolve(res.data.result.data); // 返回包含股票数据的数组
        } else {
          reject('Failed to load data');
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

function fetchDetailedStockData(gid, key) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `http://web.juhe.cn/finance/stock/hs?gid=${gid}&key=${key}`,
      method: 'GET',
      success: function(res) {
        if (res.data.error_code === 0 && res.data.result && res.data.result[0] && res.data.result[0].data) {
          resolve(res.data.result[0].data); // 返回详细的股票数据
        } else {
          reject(res.data.reason || 'Failed to load detailed data');
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

module.exports = {
  fetchStocks,
  fetchDetailedStockData
};
