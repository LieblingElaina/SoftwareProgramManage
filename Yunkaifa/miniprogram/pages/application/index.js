Page({
    data: {
      openid: '',
      session_key: '',
      num1: null,
      num2: null,
      result: null
    },
  
    onLoad() {
      wx.login({
        success: res => {
          if (res.code) {
            // 调用云函数
            wx.cloud.callFunction({
              name: 'getSession',
              data: {
                code: res.code
              },
              success: result => {
                const { openid, session_key } = result.result;
                this.setData({ openid, session_key });
              },
              fail: err => {
                console.error('云函数调用失败:', err);
              }
            });
          }
        }
      });
    },

    onNum1Input(e) {
        this.setData({
          num1: parseFloat(e.detail.value) || null
        });
      },
      
      onNum2Input(e) {
        this.setData({
          num2: parseFloat(e.detail.value) || null
        });
      },
      
      calculate() {
        const { num1, num2 } = this.data;
        
        if (num1 === null || num2 === null) {
          wx.showToast({
            title: '请输入两个数字',
            icon: 'none'
          });
          return;
        }
        
        // 调用云函数
        wx.showLoading({
          title: '计算中...',
        });
        
        wx.cloud.callFunction({
          name: 'addnumber',
          data: {
            num1,
            num2
          },
          success: res => {
            this.setData({
              result: res.result
            });
          },
          fail: err => {
            console.error('调用云函数失败：', err);
            wx.showToast({
              title: '计算失败，请重试',
              icon: 'none'
            });
          },
          complete: () => {
            wx.hideLoading();
          }
        });
      }
  });
  