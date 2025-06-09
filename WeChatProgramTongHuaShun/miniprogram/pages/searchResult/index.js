Page({
  data: {
    searchResults: []
  },

  onLoad(options) {
    if (options.searchResults) {
      this.setData({
        searchResults: JSON.parse(options.searchResults)
      });
    }
  },

  updateSearchValue(e) {
    this.setData({
      searchValue: e.detail.value
    });
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
            searchList
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