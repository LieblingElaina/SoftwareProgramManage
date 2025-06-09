// pages/zhiXuan/index.js
const db = wx.cloud.database();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    collect: []

  },
  onClick() {
    wx.request({
      url: 'http://web.juhe.cn/finance/stock/hs',
      data: {
        key: '3f69554c6e2fbe6e7e01d88d49fbe67e',
        gid: this.data.value
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        Toast.success('输入正确');
        console.log(res.data);
        var gid = res.data.result[0].data.gid
        wx.navigateTo({
          url: '../body/index?id=' + gid,
        })
      },
      fail: function (error) {
        Toast.fail('输入错误或者不存在');
        console.error(error);
      }
    });
  },
  toTap(e) {
    var id = e.currentTarget.dataset.actionid
    wx.navigateTo({
      url: '../body/index?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let phone = wx.getStorageSync('phone')
    db.collection("adddata").where({
      phone: phone // 查询存在keyid字段的记录
    }).get().then(res => {
      console.log(res);
      this.setData({
        collect: res.data
      })
    })
  },












  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.onLoad()
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

  // getSearch1(e){
  //   let data1 = e.detail.value
  //   console.log(data1)
  //   if (!data1) return
  //    wx.request({
  //      url: 'https://eq.10jqka.com.cn/wechatApplication/search/intelligentSearch',
  //      method:"POST",
  //      data:{
  //       "token":"LyQdru7Nk6STDlHFy+pcFK1gxDTmkgN0YFlpwcsY9Wocq94fWMfdyEJiQYyR8rPvIsOAQNpY83Lvs9V+5nOCg94iUykhyxq89YmXGP/SMkc8fgrWZhDNxk/xXMvgOHjPks3xjKd6WMXOYAQsp527ZHoqxIOSIwZkgdGz+akhru4=","query":data1
  //      },
  //      success:(res)=>{
  //         let searchList = JSON.parse(res.data.result.list)
  //         this.setData({
  //           searchList
  //         })
  //      }
  //    },
     
  //    )
  // },
  goToSearchPage() {
    wx.navigateTo({
      url: '../searchResult/index' 
    });
  },
  


})