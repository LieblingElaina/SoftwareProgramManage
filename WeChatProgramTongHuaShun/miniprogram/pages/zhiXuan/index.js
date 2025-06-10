// pages/zhiXuan/index.js
const db = wx.cloud.database();
import Toast from '@vant/weapp/toast/toast';
Page({

  data: {
    value: '',
    collect: []
  },
  onClick() {
    wx.request({
      url: 'http://web.juhe.cn/finance/stock/hs',
      data: {
        key: '47ed3bcd6a915ca332d9ae6a7476673b',
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
  goToSearchPage() {
    wx.navigateTo({
      url: '../searchResult/index' 
    });
  },
})