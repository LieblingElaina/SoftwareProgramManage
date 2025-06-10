// pages/login/index.js
Page({

  data: {
    phone: '',
    button: false,
    text: '',
    avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
    validateCode: '',
    codeErrorText: '',
    buttonColor: 'gray'
  },
  goBlack(){
    wx.login({
      success: (res)=>{
        let code = res.code
        wx.cloud.callFunction({
          name: 'login',
          data:{
            phone: this.data.phone,
            code
          },
          success: (res)=>{
            console.log(res)
            if (res.result.success) {
              wx.setStorageSync('phone', this.data.phone)
              wx.setStorageSync('avatarUrl', 'cloud://cloud1-2g35m8fhe6af2f25.636c-cloud1-2g35m8fhe6af2f25-1325733992/touxiang.jpg')
              wx.setStorageSync('login', '1')
              wx.showToast({
                title:"登录成功",
                icon:"success"
              })
              wx.navigateBack({
                detail:1
              })
            }
          }
        })
      }
    })
    // wx.switchTab({
    //   url: '/pages/hangQing/index'
    // })
  },
  onChooseAvatar(e) {
    console.log(e);
    wx.cloud.uploadFile({
      cloudPath:new Date().getTime()+'_'+Math.floor(Math.random()*1000)+".jpg",
      filePath:e.detail.avatarUrl ,
      config: {
        env: 'cloud1-2g44zeqaf2265de9' // 需要替换成自己的微信云托管环境ID
      }
    }).then(res=>{
      this.setData({
        avatarUrl:res.fileID
      })
      console.log(res.fileID);
    })
  },
  btn() {
    // var reg = new RegExp(pattern, flags);
    var reg = /^(13[0-9]|14[579]|15[0-35-9]|166|17[01345678]|18[0-9]|19[89])\d{8}$/
    if (reg.test(this.data.phone)) {
      this.setData({
        button: true,
        text: ''
      })
    } else {
      this.setData({
        text: '号码格式错误'
      })
    }
  }
})