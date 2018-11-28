const app = getApp()

Component({
  properties: {
    // show: Boolean,
  },

  data: {
    show: true
  },

  methods: {
    show() {
      this.setData({
        show: false
      })
    },

    hide() {
      this.setData({
        show: true
      })
    },

    // 点击登录
    comfirmTrue(e) {
      console.log(e)
      const data = e.detail.userInfo
      this.setData({
        show: true
      })
      if(!data) {
        return 
      }
      const params = {
        scode: wx.getStorageSync('shopId'),
        name: data.nickName,
        sex: data.gender,
        pic: data.avatarUrl,
        region: `${data.province} ${data.city}`
      }
      app.$api.getLogin(params).then(res => {
        this.triggerEvent('loginTrue', res)
      })
    },

  }
})
