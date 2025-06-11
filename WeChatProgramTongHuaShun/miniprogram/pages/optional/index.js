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