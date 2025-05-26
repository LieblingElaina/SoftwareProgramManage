const util = require('../../utils/util')
Page({
    data: {
        dateStr: '',
        timer: null,
        tabs: ['涨幅榜', '跌幅榜', '成交额', '涨速榜'],
        activeTab: 0,
        riseData: [
            { id: 1, name: '佰维存储', price: '44.92', change: 20.01, speed: 0.52, code: '688525' },
            { id: 2, name: '苏交科', price: '8.72', change: 19.95, speed: 3.12, code: '300284' }
        ],
        fallData: [
            { id: 4, name: '贵州茅台', price: '1619.50', change: -9.87, speed: -1.36, code: '600519' },
            { id: 5, name: '隆基绿能', price: '25.34', change: -7.13, speed: -0.21, code: '601012' }
        ],
        volumeData: [
            { id: 6, name: '佰维存储', price: '44.92', change: 20.01, speed: 0.52, code: '688525' },
            { id: 7, name: '五粮液', price: '165.33', change: 6.78, speed: 1.12, code: '000858' }
        ],
        speedData: [
            { id: 8, name: '苏交科', price: '8.72', change: 19.95, speed: 3.12, code: '300284' },
            { id: 9, name: '中国平安', price: '48.21', change: 4.21, speed: 1.80, code: '601318' }
        ],
        currentData: []
    },
    navigateToLogin() {
        wx.navigateTo({
          url: '/pages/login/login'
        });
      },
    onLoad() {
        const activeTab = this.data.activeTab;
        let currentData = [];
        switch (activeTab) {
            case 0:
                currentData = this.data.riseData;
                break;
            case 1:
                currentData = this.data.fallData;
                break;
            case 2:
                currentData = this.data.volumeData;
                break;
            case 3:
                currentData = this.data.speedData;
                break;
        }
        this.setData({
            currentData: currentData
        });
    },

    switchTab(e) {
        const index = e.currentTarget.dataset.index;
        let currentData = [];
        switch (index) {
            case 0:
                currentData = this.data.riseData;
                break;
            case 1:
                currentData = this.data.fallData;
                break;
            case 2:
                currentData = this.data.volumeData;
                break;
            case 3:
                currentData = this.data.speedData;
                break;
        }
        this.setData({
            activeTab: index,
            currentData: currentData
        });
    },
})   