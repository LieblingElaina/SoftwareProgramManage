Page({
    data: {
      phoneNumber: '',
      isBtnEnable: false
    },
    handlePhoneInput(e) {
      const value = e.detail.value;
      this.setData({
        phoneNumber: value
      });
      // 输入内容长度符合手机号规则（简单判断，可更严谨）时启用按钮
      this.setData({
        isBtnEnable: value.length === 11
      });
    },
    async handleLogin() {
      const { phoneNumber } = this.data;
      // 获取用户 openid 等信息（需先调用云函数获取）
      const { result: { openid, session_key } } = await wx.cloud.callFunction({
        name: 'getOpenId' // 需创建该云函数获取 openid
      });
      // 调用云函数处理登录逻辑
      const loginRes = await wx.cloud.callFunction({
        name: 'userLogin',
        data: {
          phoneNumber,
          openid,
          session_key
        }
      });
      if (loginRes.result.code === 0) {
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
        // 存储登录状态到本地，方便下次自动登录判断
        wx.setStorageSync('loginStatus', 1); 
        wx.setStorageSync('phoneNumber', phoneNumber); 
        // 跳转到行情页
        wx.switchTab({
          url: '/pages/Market/Market'
        });
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    }
  });