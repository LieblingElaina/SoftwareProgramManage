Page({
    data: {
      loginStatus: 0,
      avatarUrl: '', // 可根据实际设置头像，若有
      showAction: false
    },
    onLoad() {
      // 检查本地存储的登录状态，实现自动登录判断
      const loginStatus = wx.getStorageSync('loginStatus');
      const phoneNumber = wx.getStorageSync('phoneNumber');
      if (loginStatus === 1 && phoneNumber) {
        this.setData({
          loginStatus: 1
        });
      }
    },
    goToLogin() {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    },
    showActionSheet() {
      this.setData({
        showAction: true
      });
    },
    hideActionSheet() {
      this.setData({
        showAction: false
      });
    },
    switchPhone() {
      this.hideActionSheet();
      wx.navigateTo({
        url: '/pages/login/login'
      });
    },
    async handleLogout() {
      this.hideActionSheet();
      const phoneNumber = wx.getStorageSync('phoneNumber');
      // 调用云函数更新退出登录状态
      await wx.cloud.callFunction({
        name: 'userLogout',
        data: {
          phoneNumber
        }
      });
      wx.showToast({
        title: '退出登录成功',
        icon: 'success'
      });
      // 清除本地存储的登录状态等
      wx.removeStorageSync('loginStatus');
      wx.removeStorageSync('phoneNumber'); 
      this.setData({
        loginStatus: 0
      });
    }
  });