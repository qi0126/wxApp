const app = getApp()

Page({
  data: {
    code: ``,
    user: ``,
    name: ``,
    birthday: ``
  },

  bindPickerChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },

  getPhoneNumber(e) {
    const { code, name, birthday} = this.data
    const { encryptedData, iv } = e.detail
    const params = {
      wxcode: this.data.code,
      data: encryptedData,
      iv,
      name,
      birthday,
    }
    this.save(params, this.getInfo)
  },

  // 得到姓名
  getName(e) {
    const name = e.detail.value
    this.setData({
      name
    })
  },

  goCode() {
    wx.navigateTo({
      url: '/pages/me/getPhone/getPhone',
    })
  },

  save(params, callback) {
    app.$api.userEditInfo(params).then(res => {
      if (res.code === 1001) {
        app.$u.showToast('手机验证已超时，请重新验证')
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/me/getPhone/getPhone',
          })
        }, 800)
      }
      return 
      callback()
    })
  },

  saveInfo(e) {
    const { name, birthday, phone, msgcode } = this.data
    const params = {
      name,
      birthday,
    }
    if (wx.getStorageSync('phone')) {
      const otherParams = {
        phone,
        msgcode
      }
      Object.assign(params, otherParams)
    }
    this.save(params, () => {
      app.$u.showToast('修改成功')
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 800)
    })
  },

  getInfo() {
    app.$api.userMyinfo().then(res => {
      const user = res.data
      user.birthday = user.birthday && app.$d(user.birthday).format('YYYY-MM-DD')
      this.setData({
        user,
        birthday: user.birthday,
        name: user.realName
      })

      if (wx.getStorageSync('phone')) {
        const { phone, code } = wx.getStorageSync('phone')
        this.data.user.phone = phone
        this.setData({
          phone,
          msgcode: code,
          user: this.data.user
        })
      }

    })
  },

  onShow() {
    const self = this
    wx.login({
      success(res) {
        self.setData({
          code: res.code
        })
      }
    })

    this.getInfo() 
  },

  onLoad() {

  },

  onHide() {
    wx.removeStorageSync('phone')
  },

  onUnload() {
    wx.removeStorageSync('phone')
  }
  
  
})