// pages/index/index.js
const api = require('../../utils/api.js');

Page({
  data: {
    recommendedStocks: []
  },

  onLoad: function () {
    this.loadInitialStocks();
  },

  loadInitialStocks: function () {
    const key = "47ed3bcd6a915ca332d9ae6a7476673b"; // 确保使用有效的APPKEY
    Promise.all([
      api.fetchStocks('http://web.juhe.cn/finance/stock/szall?key=' + key), // 深圳股市
      api.fetchStocks('http://web.juhe.cn/finance/stock/shall?key=' + key) // 上海股市
    ]).then(results => {
      if (results && results[0] && results[1]) {
        const combinedStocks = [...results[0], ...results[1]];
        this.filterAndFetchDetails(combinedStocks, key);
      } else {
        console.error("Error: One of the API responses is undefined");
      }
    }).catch(err => {
      console.error("Error fetching stocks:", err);
    });
  },

  filterAndFetchDetails: function (stocks, key) {
    // 确保 stocks 有效
    if (!stocks || stocks.length === 0) {
      console.error("Error: No stocks to process");
      return;
    }
    // 筛选和排序
    const selectedStocks = stocks.filter(stock => stock.changepercent > 2 && stock.volume > 50000)
      .sort((a, b) => parseFloat(b.changepercent) - parseFloat(a.changepercent))
      .slice(0, 5);

    // 获取详细数据
    const detailedPromises = selectedStocks.map(stock => api.fetchDetailedStockData(stock.symbol, key));
    Promise.all(detailedPromises)
      .then(details => {
        // 检查 details
        if (!details || details.length === 0) {
          console.error("Error: No detailed stock data found");
          return;
        }
        this.setData({
          recommendedStocks: details.map(detail => ({
            name: detail.name,
            symbol: detail.gid, // 确保 API 响应中有这个字段
            price: detail.nowPri,
            high: detail.todayMax,
            low: detail.todayMin,
            change: detail.increPer,
            volume: detail.traNumber,
            amount: detail.traAmount,
            reason: this.generateDynamicReason(detail) // 调用推荐理由生成函数
          }))
        });
      })
      .catch(err => {
        console.error("Error fetching detailed stock data:", err);
      });
  },

  generateDynamicReason: function (stockDetail) {
    let reasons = [];
    // 段落1：涨幅情况
    if (parseFloat(stockDetail.increPer) > 5) {
      reasons.push({
        title: "强劲上涨",
        description: `股票强劲上涨超过5% (${stockDetail.increPer}%)，显示出强烈的市场积极性。`
      });
    }
    // 段落2：成交量
    if (parseInt(stockDetail.traNumber) > 100000) {
      reasons.push({
        title: "高成交量",
        description: `高成交量表明股票目前非常活跃，成交量达到${stockDetail.traNumber}股。`
      });
    }
    // 段落3：价格波动
    if (parseFloat(stockDetail.todayMax) - parseFloat(stockDetail.todayMin) > parseFloat(stockDetail.yestodEndPri) * 0.05) {
      reasons.push({
        title: "价格波动",
        description: `今日价格波动较大，可能存在交易机会 (最高价: ${stockDetail.todayMax}, 最低价: ${stockDetail.todayMin})。`
      });
    }
    // 段落4：股价比较
    if (parseFloat(stockDetail.nowPri) > parseFloat(stockDetail.yestodEndPri)) {
      reasons.push({
        title: "上升趋势",
        description: `今日股价高于昨日收盘，表现出上升趋势 (当前价: ${stockDetail.nowPri}, 昨收价: ${stockDetail.yestodEndPri})。`
      });
    }
    return reasons;
},

  goToMarketPage: function () {
    wx.navigateTo({
      url: 'pages/hangQing/index'  // 确保路径正确
    });
  }
});