const db = wx.cloud.database();
const util = require('../../utils/util');
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
        name: '微博',
        icon: 'weibo'
      },
      {
        name: '复制链接',
        icon: 'link'
      },
      {
        name: '分享海报',
        icon: 'poster'
      },
      {
        name: '二维码',
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
        key: 'a905112d2213e4d9f822886e3bdd60a8'
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  requestNews(){
    if (!this.data.hasMoreNews) return
    let url = `https://eq.10jqka.com.cn/wechatApplication/listv4/hs/${this.data.id.substr(2)}_${this.data.currentPage+1}.json`
    console.log(url)
    wx.request({
      url: url,
      success: (res)=>{
        // console.log(res)
        if (res.data.code === "200"){
          let _news = this.data.news
          _news.push(...(res.data.data.pageItems.map(it => {
            it.time = util.formatTimestamp(it.ctime*1000)
            return it
          })))
          this.setData({
            news: _news,
            hasMoreNews: res.data.data.hasMore === "1",
            currentPage: res.data.data.currentPage
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
    // console.log("用户分享")
    return {
      title:"同花顺("+this.data.id+")",
      path: `/pages/body/index?id=${this.data.id}`
    }
  },
});