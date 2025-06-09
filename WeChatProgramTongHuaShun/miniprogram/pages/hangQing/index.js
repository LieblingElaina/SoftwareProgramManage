// pages/hangQing/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shdata: {},
    szdata: {},
    date: '',
    active: 0,
    show: true,
    showBlock: false,
    phone: "",
    avatarUrl: '',
    showNews:true,
    isAscending: true,
    news: [],      // 存储新闻数据
    isCollapse: true  // 控制新闻详情的展开和折叠
  },
  newsShow(){
    this.setData({
      showNews:!this.data.showNews
    })
  },
  toTap(e) {
    var id = e.currentTarget.dataset.actionid
    console.log(id)
    wx.navigateTo({
      url: '../body/index?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
 
  onLoad(options) {
    this.requestNews(),
    this.getTime()
    wx.request({
      url: 'http://web.juhe.cn/finance/stock/shall',
      data: {
        stock: 'a',
        key: '47ed3bcd6a915ca332d9ae6a7476673b'
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data && res.data.result && res.data.result.data) {
          const data = res.data.result.data;
  
          // 计算涨速并添加到每个项目
          const updatedData = data.map(item => ({
            ...item,
            displayPercentage: ((item.settlement - item.open) / item.settlement * 100).toFixed(2)
          }));
  
          // 排序涨幅榜
          const sortedRiseList = [...updatedData].sort((a, b) => parseFloat(b.changepercent) - parseFloat(a.changepercent));
  
          // 排序跌幅榜
          const sortedFallList = [...updatedData].sort((a, b) => parseFloat(a.changepercent) - parseFloat(b.changepercent));
  
          // 排序成交额榜
          const sortedVolumeList = [...updatedData].sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
  
          // 排序涨速榜
          const sortedSpeedList = [...updatedData].sort((a, b) => parseFloat(b.displayPercentage) - parseFloat(a.displayPercentage));
  
          this.setData({
            list: sortedRiseList,
            fallList: sortedFallList,
            volumeList: sortedVolumeList,
            speedList: sortedSpeedList  // 新增涨速榜数据
          });
        }
      },
      fail: function (error) {
        console.error(error);
      }
    });
    // 创建一个Date对象，表示当前日期和时间
    var currentDate = new Date();

    // 获取年份
    var year = currentDate.getFullYear();

    // 获取月份（注意：月份是从0开始的，所以要加1）
    var month = currentDate.getMonth() + 1;
    month = month < 10 ? 0 + month : month; // 如果月份是一位数，前面补0

    // 获取日期
    var date = currentDate.getDate();
    date = date < 10 ? 0 + date : date; // 如果日期是一位数，前面补0

    // 获取星期几（0代表周日，1代表周一，以此类推）
    var dayOfWeek = currentDate.getDay();
    console.log(dayOfWeek);
    var weekDay = ['日', '一', '二', '三', '四', '五', '六'][dayOfWeek];

    // 拼接成完整的日期和星期几字符串
    var formattedDate = year + '年' + month + '月' + date + '日' + '星期' + weekDay;
    this.setData({
      date: formattedDate
    })
    console.log(formattedDate); // 输出类似：2024年06月03日 五
    // 上海股票
    wx.request({
      url: 'http://web.juhe.cn/finance/stock/hs',
      data: {
        key: '47ed3bcd6a915ca332d9ae6a7476673b',
        type: 0
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res.data);
        this.setData({
          shdata: res.data.result
        })
      },
      fail: function (error) {
        console.error(error);
      }
    });

    // 深圳股票
    wx.request({
      url: 'http://web.juhe.cn/finance/stock/hs',
      data: {
        key: '47ed3bcd6a915ca332d9ae6a7476673b',
        type: 1
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res.data);
        this.setData({
          szdata: res.data.result
        })
      },
      fail: function (error) {
        console.error(error);
      }
    });


  },
  onClose() {
    this.setData({
      showBlock: false
    })
  },
  onClickLeft() {
    const logincode = wx.getStorageSync('login')
    if (logincode == 0) {
      wx.navigateTo({
        url: '/pages/login/index'
      })
    } else if (logincode == 1) {
      const avatarUrl = wx.getStorageSync('avatarUrl')
      const phone = wx.getStorageSync('phone')
      this.setData({
        showBlock: true,
        avatarUrl: avatarUrl,
        phone: phone,
        show:false

      })
      console.log("我进来了");
    }
  },
  changNum() {
    wx.removeStorage({
      key: 'avatarUrl',
    })
    wx.removeStorage({
      key: 'phone',
    })
    wx.setStorage({
      key: 'login',
      data: '0'
    })
    this.setData({
      show: true,
      showBlock:false
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },
  getTime(){
    wx.request({
      url:"https://eq.10jqka.com.cn/wechatApplication/search/searchIndex",
      success:(res)=>{
       let TitleTime=res.data.result.jyr.split(',')[0]
       this.setData({
         TitleTime
       })
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
this.setData()
  },
showData(){
  const logincode = wx.getStorageSync('login')
  if (logincode == 1) {
    const avatarUrl = wx.getStorageSync('avatarUrl')
    const phone = wx.getStorageSync('phone')
    this.setData({
      avatarUrl: avatarUrl,
      phone: phone,
      show:false
    })
  }
},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  requestNews(){
    wx.request({
      url: 'https://news.10jqka.com.cn/tapp/news/headline/ths',
      success: (res) => {
        // console.log(res)
        if(res.data.code === 200) {
          let _data = res.data.data.filter(it => it.type === 1)
          this.setData({
            news: _data
          })
        }
      }
    })
  },
  changeCollapse: function() {
    this.setData({
      isCollapse: !this.data.isCollapse
    });
  },
})




