const db = wx.cloud.database();
const util = require('../../utils/util');
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    gif: {},
    list: {},
    id: '',
    show: false,
    showShare: false,
    options: [{
        name: '微信',
        icon: 'wechat',
        openType: 'share'
      },
      {
        name: '复制链接',
        icon: 'link'
      },
      {
        name: '二维码分享',
        icon: 'qrcode'
      },
    ],
    news: [],
    hasMoreNews: true,
    currentPage: 0,
    symbol: 'some-symbol'
  },
  onClick(event) {
    this.setData({
      showShare: true
    });
  },

  onClose() {
    this.setData({
      showShare: false
    });
  },

  onSelect(event) {
    Toast(event.detail.name);
    this.onClose();
  },

  showTap1() {
    let phone = wx.getStorageSync('phone')
    db.collection('adddata').where({
      ['idkey']: this.data.id,
      phone: phone
    }).remove().then(res=>{
      console.log(res);
    })
    this.setData({
      show: false
    })
  },

  showTap2() {
    let phone = wx.getStorageSync('phone')
    const db = wx.cloud.database()
    db.collection('adddata').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        'idkey': this.data.id,
        'list': this.data.list,
        'phone': phone
      },
    }).then(res => {
      console.log(res);
    })
    this.setData({
      show: true
    })
  },

  onLoad(options) {
    this.data.id = options.id
    this.requestNews(), // 初始加载新闻
    wx.request({
      url: 'http://web.juhe.cn/finance/stock/hs',
      data: {
        gid: this.data.id,
        key: '3f69554c6e2fbe6e7e01d88d49fbe67e'
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res.data);
        let name = res.data.result[0].data.name
        this.setData({
          gif: res.data.result[0].gopicture,
          list: res.data.result[0].data
        })
        wx.setNavigationBarTitle({
          title: `${name}(${this.data.id.substr(2)})`,
        })
      },
      fail: function (error) {
        console.error(error);
      }
    });
  },

  onReady() {
    let phone = wx.getStorageSync('phone')
    if (!phone) return
    const db = wx.cloud.database();
    // 查询数据库，判断ID是否存在于收藏列表中
    db.collection('adddata').where({
      idkey: db.command.eq(this.data.id)
    }).get().then(res => {
      console.log(res);
      if (res.data.length > 0) {
        // ID存在
        this.setData({
          show: true
        });
        console.log("ID存在");
      } else {
        console.log("ID不存在");
      }
    }).catch(err => {
      console.log("错误");
    })
  },

  requestNews(){
    wx.request({
      url: 'https://news.10jqka.com.cn/tapp/news/headline/ths',
      success: (res) => {
        if(res.data.code === 200) {
           let _data = res.data.data.filter(it => it.type === 1)
           this.setData({
             news: _data
           })
        }
      }
    })
 },

  onReachBottom() {
    this.requestNews(); // 当用户滑到页面底部时，加载更多新闻
  },
  
  onPullDownRefresh() {
    // 可以添加下拉刷新新闻的逻辑
    wx.stopPullDownRefresh(); // 停止下拉刷新动画
  },

  onShareAppMessage() {
    return {
      title:"同花顺("+this.data.id+")",
      path: `/pages/body/index?id=${this.data.id}`
    }
  },
});