// pages/Detail/Detail.js
const { formatNumber } = require('../../utils/load');
Page({
  data: {
    stockName: ' ',
    stockCode: ' ',
    currentPrice: 0,
    preClose: 0,
    highPrice: 0,
    lowPrice: 0,
    openPrice: 0,
    turnoverRate: 0,
    volume: 0,
    amount: 0,
    bids: [],
    asks: [],
    activeChart: 'minute',
    market: 'sh',
    chartUrl: '',
    isLoading: true,
    newsList: [],
    activeTab: 'detail'
  },
  formatDataForDisplay(data) 
  {
    const defaultArray = Array(5).fill({ price: 0, volume: 0 });
    return {
      stockName: data.stockName,
      stockCode: data.stockCode,
      currentPrice: formatNumber(data.currentPrice),
      preClose: formatNumber(data.preClose),
      highPrice: formatNumber(data.highPrice),
      lowPrice: formatNumber(data.lowPrice),
      openPrice: formatNumber(data.openPrice),
      turnoverRate: formatNumber(data.turnoverRate),
      volume: formatNumber(data.volume / 10000) + '万手',
      amount: formatNumber(data.amount / 100000000) + '亿元',
      bids: (data.bids || defaultArray).map(item => ({
        price: formatNumber(item.price || 0),
        volume: item.volume || 0
      })),
      asks: (data.asks || defaultArray).map(item => ({
        price: formatNumber(item.price || 0),
        volume: item.volume || 0
      })),
    };
  },
  onLoad(options) {
    const stockName = options.stockName;
    const stockCode = options.stockCode;
    this.setData({
      stockName,
      stockCode
    });
    wx.setNavigationBarTitle({
      title: `${stockName} (${stockCode})`
    });
    const market = stockCode.startsWith('6') ? 'sh' : 'sz';
    
    this.setData({
      stockName,
      stockCode,
      market
    });
    this.fetchStockData();
    this.dataInterval = setInterval(() => {
      this.fetchStockData();
    }, 5000);
  },
  navigateToNewsDetail(e) {
    const newsId = e.currentTarget.dataset.newsid;
    wx.navigateTo({
      url: `/pages/news-detail/news-detail?newsId=${newsId}`
    });
  },
  fetchStockData() {
    this.setData({ isLoading: true });
    
    wx.request({
      url: `https://hq.sinajs.cn/list=${this.data.market}${this.data.stockCode}`,
      header: {
        'Content-Type': 'application/javascript; charset=gbk'
      },
      success: (res) => {
        const dataStr = res.data;
        const start = dataStr.indexOf('"') + 1;
        const end = dataStr.lastIndexOf('"');
        const dataArray = dataStr.slice(start, end).split(',');
        
        // 解析数据
        if (dataArray.length > 30) {
          const stockData = {
            name: dataArray[0], // 股票名称
            open: parseFloat(dataArray[1]), // 今开
            preClose: parseFloat(dataArray[2]), // 昨收
            current: parseFloat(dataArray[3]), // 当前价格
            high: parseFloat(dataArray[4]), // 今日最高
            low: parseFloat(dataArray[5]), // 今日最低
            bidPrice: parseFloat(dataArray[6]), // 竞买价
            askPrice: parseFloat(dataArray[7]), // 竞卖价
            volume: parseInt(dataArray[8]), // 成交量(股)
            amount: parseFloat(dataArray[9]), // 成交金额(元)
            bids: [
              { price: parseFloat(dataArray[11]), volume: parseInt(dataArray[10])/100 }, // 买1
              { price: parseFloat(dataArray[13]), volume: parseInt(dataArray[12])/100 }, // 买2
              { price: parseFloat(dataArray[15]), volume: parseInt(dataArray[14])/100 }, // 买3
              { price: parseFloat(dataArray[17]), volume: parseInt(dataArray[16])/100 }, // 买4
              { price: parseFloat(dataArray[19]), volume: parseInt(dataArray[18])/100 }  // 买5
            ],
            asks: [
              { price: parseFloat(dataArray[21]), volume: parseInt(dataArray[20])/100 }, // 卖1
              { price: parseFloat(dataArray[23]), volume: parseInt(dataArray[22])/100 }, // 卖2
              { price: parseFloat(dataArray[25]), volume: parseInt(dataArray[24])/100 }, // 卖3
              { price: parseFloat(dataArray[27]), volume: parseInt(dataArray[26])/100 }, // 卖4
              { price: parseFloat(dataArray[29]), volume: parseInt(dataArray[28])/100 }  // 卖5
            ],
            date: dataArray[30], // 日期
            time: dataArray[31],  // 时间
          };
          this.formatDataForDisplay(res.data);
          
          const totalShares = 100000000;
          const turnoverRate = (stockData.volume / totalShares * 100).toFixed(2);
          
          this.setData({
            stockName: stockData.name,
            currentPrice: stockData.current,
            preClose: stockData.preClose,
            highPrice: stockData.high,
            lowPrice: stockData.low,
            openPrice: stockData.open,
            turnoverRate,
            volume: stockData.volume,
            amount: stockData.amount,
            bids: stockData.bids,
            asks: stockData.asks,
            chartUrl: this.getChartUrl(),
            isLoading: false
          });
          console.log(stockData.bids);
        }
      },
      fail: (err) => {
        console.error('获取股票数据失败:', err);
        this.setData({ isLoading: false });
        wx.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      }
    });

    this.initShare();
  },

  // 初始化分享功能
  initShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
  },

  // 获取图表
  getChartUrl() {
    const { market, stockCode, activeChart } = this.data;
    const baseUrl = 'https://image.sinajs.cn/newchart';
    
    switch(activeChart) {
      case 'minute':
        return `${baseUrl}/min/n/${market}${stockCode}.gif`;
      case 'day':
        return `${baseUrl}/daily/n/${market}${stockCode}.gif`;
      case 'week':
        return `${baseUrl}/weekly/n/${market}${stockCode}.gif`;
      case 'month':
        return `${baseUrl}/monthly/n/${market}${stockCode}.gif`;
      default:
        return `${baseUrl}/min/n/${market}${stockCode}.gif`;
    }
  },

  // 切换图表
  switchChart(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      activeChart: type,
      chartUrl: this.getChartUrl()
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === 'share') {
      this.onShareAppMessage(); 
      return;
    }
    this.setData({ activeTab: tab });
    if (tab !== 'detail') {
      wx.switchTab({
        url: `/pages/${tab}/${tab}`
      });
    }
  },

  handleShare() {
    // 激活当前页面的分享功能
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    });

    wx.showModal({
        title: '分享内容',
        content: `股票名称：${this.data.stockName}\n股票代码：${this.data.stockCode}\n当前价格：${this.data.currentPrice}`,
        confirmText: '去分享',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '请点击右上角菜单分享',
              icon: 'none'
            });
          }
        }
      });
  },
    
 
  onShareAppMessage() {
    return {
        title: `${this.data.stockName}(${this.data.stockCode}) 最新价 ${this.data.currentPrice}`,
        path: `/pages/Detail/Detail?stockCode=${this.data.stockCode}`,
      success: (res) => {
        wx.showToast({
          title: '分享成功'
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '分享失败'
        });
      }
    };
  }
})