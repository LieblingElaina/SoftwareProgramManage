// pages/index.js
Page({
  data: {
    searchValue: '',
    stocks: [
      { id: 1, name: '浦发银行', code: '600000', newPrice: 15.24 },
      { id: 2, name: '格力电器', code: '000651', newPrice: 56.32 },
      { id: 3, name: '京东方A', code: '000725', newPrice: 3.87 },
      { id: 4, name: '招商银行', code: '600036', newPrice: 39.50 },
      // { id: 5, name: }
    ],
    filteredStocks: [],
    balance: 20000,
    operationLogs: [] , // 用于存储操作记录
    searchResults: []
  },

  onInput(e) {
    this.setData({ searchValue: e.detail.value });
  },

  // onSearch() {
  //   // const value = this.data.searchValue.toLowerCase();
  //   const filteredStocks = this.data.stocks.filter(stock => 
  //     stock.name.toLowerCase().includes(value) || stock.code.startsWith(value)
  //   );
  //   this.setData({ filteredStocks });
  //   if (filteredStocks.length === 0) {
  //     wx.showToast({
  //       title: '未找到股票',
  //       icon: 'none'
  //     });
  //   }
  // },

  onLoad() {
    this.setData({ filteredStocks: this.data.stocks });
  },

  buyStock(e) {
    const id = e.currentTarget.dataset.id;
    const stock = this.data.filteredStocks.find(stock => stock.id === id);
    if (this.data.balance >= stock.newPrice * 100) {
      this.setData({ 
        balance: this.data.balance - stock.newPrice * 100,
        operationLogs: this.data.operationLogs.concat({
          type: '买入',
          name: stock.name,
          amount: stock.newPrice,
          date: new Date().toLocaleString()
        })
      });
      wx.showToast({ title: '购买成功' });
    } else {
      wx.showToast({ title: '资金不足', icon: 'none' });
    }
  },

  sellStock(e) {
    const id = e.currentTarget.dataset.id;
    const stock = this.data.filteredStocks.find(stock => stock.id === id);
    this.setData({
      balance: this.data.balance + stock.newPrice * 100,
      operationLogs: this.data.operationLogs.concat({
        type: '卖出',
        name: stock.name,
        amount: stock.newPrice,
        date: new Date().toLocaleString()
      })
    });
    wx.showToast({ title: '卖出成功' });
  },



  getSearch1(e) {
    console.log(this.data.searchValue)
    if (!this.data.searchValue) return
    wx.request({
        url: 'https://eq.10jqka.com.cn/wechatApplication/search/intelligentSearch',
        method: "POST",
        data: {
          "token": "LyQdru7Nk6STDlHFy+pcFK1gxDTmkgN0YFlpwcsY9Wocq94fWMfdyEJiQYyR8rPvIsOAQNpY83Lvs9V+5nOCg94iUykhyxq89YmXGP/SMkc8fgrWZhDNxk/xXMvgOHjPks3xjKd6WMXOYAQsp527ZHoqxIOSIwZkgdGz+akhru4=",
          "query": this.data.searchValue
        },
        success: (res) => {
          let searchList = JSON.parse(res.data.result.list)
          this.setData({
            filteredStocks: searchList
          })
        },
        fail: (error) => {
          console.error("请求失败:", error);
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          });
        }

      },

    )
  },
});
