// pages/optional/optional.js
Page({

    data: {
      stockList: [
        { name: '聚杰纤维', code: '300819', price: 26.21, change: '-5.64' },
        { name: '佰维存储', code: '688525', price: 44.92, change: '20.01' },
        { name: '苏交科', code: '300284', price: 8.72, change: '19.95' },
        { name: '隆基绿能', code: '601012', price: 25.34, change: '-2.13' },
        { name: '比亚迪', code: '002594', price: 265.88, change: '1.05' },
        { name: '贵州茅台', code: '600519', price: 1789.50, change: '-0.87' },
        { name: '宁德时代', code: '300750', price: 225.77, change: '0.33' },
        { name: '招商银行', code: '600036', price: 35.67, change: '-0.55' },
        { name: '中国平安', code: '601318', price: 48.21, change: '0.21' },
        { name: '五粮液', code: '000858', price: 165.33, change: '0.78' },
        { name: '立讯精密', code: '002475', price: 28.90, change: '-1.22' }
      ]
    },
    navigateToDetail(e){
      const stockName = e.currentTarget.dataset.name;
      const stockCode = e.currentTarget.dataset.code;
      wx.navigateTo({
        url: `/pages/Detail/Detail?stockName=${stockName}&stockCode=${stockCode}`
      })
    },

  })