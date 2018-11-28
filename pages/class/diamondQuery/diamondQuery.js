const app = getApp()

Page({
  data: {
  },

  goGIA() {
    wx.navigateTo({
      url: '/pages/class/GIA/GIA',
    })
  },

  goDiamond() {
    wx.navigateTo({
      url: '/pages/class/diamondRotate/diamondRotate',
    })
  },

  onLoad(options) {

  },

  onShow() {
  }

})
